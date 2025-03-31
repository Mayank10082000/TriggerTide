import { Agenda } from "@hokify/agenda";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Create Agenda instance with MongoDB connection
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: "jobs",
  },
  processEvery: "1 minute",
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Define the email sending job
agenda.define(
  "send email",
  async (job) => {
    const { to, subject, body } = job.attrs.data;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: body,
    });
  },
  { priority: "high", concurrency: 10 }
);

export const scheduleFlowEmails = async (flow) => {
  try {
    const { nodes, edges } = flow;
    const scheduledJobs = [];

    // Create maps for quick access - keep these the same
    const nodeMap = nodes.reduce((map, node) => {
      map[node.id] = node;
      return map;
    }, {});

    const edgeMap = edges.reduce((map, edge) => {
      map[edge.source] = edge.target;
      return map;
    }, {});

    // Start from all lead sources
    for (const node of nodes) {
      if (node.type === "leadSource") {
        // CHANGE THIS PART TO HANDLE ARRAY OF EMAILS
        const emailData = node.data.email;
        if (!emailData) continue;

        // Handle both array of emails and single email string
        const emailList = Array.isArray(emailData) ? emailData : [emailData];

        // Process each email in the array
        for (const leadEmail of emailList) {
          if (!leadEmail) continue;

          let currentNode = node;
          let cumulativeDelay = 0;

          // Rest of your original code remains the same
          while (currentNode && edgeMap[currentNode.id]) {
            const nextNodeId = edgeMap[currentNode.id];
            const nextNode = nodeMap[nextNodeId];

            if (!nextNode) break;

            // Handle delay nodes
            if (currentNode.type === "waitDelay") {
              const { delayTime, delayUnit = "minutes" } = currentNode.data;
              // Convert to minutes based on unit
              const delayInMinutes =
                delayUnit === "hours"
                  ? delayTime * 60
                  : delayUnit === "days"
                  ? delayTime * 1440
                  : delayTime;

              cumulativeDelay += delayInMinutes;
            }

            // Handle email nodes
            if (nextNode.type === "coldEmail") {
              const { subject, body } = nextNode.data;
              const recipient = nextNode.data.recipient || leadEmail;

              // Schedule the email with AgendaTS
              const job = await agenda.schedule(
                `in ${cumulativeDelay} minutes`,
                "send email",
                { to: recipient, subject, body }
              );

              scheduledJobs.push(job.attrs._id.toString());
            }

            currentNode = nextNode;
          }
        }
      }
    }

    return scheduledJobs;
  } catch (error) {
    console.error("Error in scheduleFlowEmails:", error);
    return [];
  }
};

// Start agenda when MongoDB connects
mongoose.connection.once("connected", async () => {
  console.log("Starting Agenda job scheduler...");
  await agenda.start();
});

export default agenda;
