import Agenda from "agenda";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const agenda = new Agenda({
  mongo: mongoose.connection, // Use the existing mongoose connection
  collection: "jobs", // Store jobs in a separate collection
  processEvery: "1 minute",
});

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

agenda.define("send email", async (job) => {
  const { to, subject, body } = job.attrs.data;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: body,
  });
});

export const scheduleFlowEmails = async (flow) => {
  try {
    console.log("Starting to schedule emails for flow:", flow._id);
    const { nodes, edges } = flow;

    // Create a more detailed map of your nodes
    const nodeMap = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = node;
      console.log(`Adding node to map: ${node.id}, type: ${node.type}`);
    });

    // Create a map of connections
    const edgeMap = {};
    edges.forEach((edge) => {
      edgeMap[edge.source] = edge.target;
      console.log(`Adding edge: ${edge.source} -> ${edge.target}`);
    });

    const scheduledJobs = [];

    // Start from all lead sources
    for (const node of nodes) {
      if (node.type === "leadSource") {
        console.log("Processing lead source:", node.id);
        let currentNode = node;
        let cumulativeDelay = 0;
        const visitedNodes = new Set();

        while (currentNode && !visitedNodes.has(currentNode.id)) {
          visitedNodes.add(currentNode.id);
          console.log(
            `Processing node: ${currentNode.id}, type: ${currentNode.type}`
          );

          // Process delays
          if (currentNode.type === "waitDelay" && currentNode.data) {
            const { delayTime, delayUnit = "minutes" } = currentNode.data;
            cumulativeDelay +=
              delayUnit === "hours"
                ? delayTime * 60
                : delayUnit === "days"
                ? delayTime * 1440
                : delayTime;
            console.log(
              `Added delay: ${delayTime} ${delayUnit}, total: ${cumulativeDelay} minutes`
            );
          }

          // Process emails
          if (currentNode.type === "coldEmail" && currentNode.data) {
            const subject = currentNode.data.subject || "No Subject";
            const body = currentNode.data.body || "No Body";
            const recipient = node.data.email || currentNode.data.recipient;

            console.log(
              `Email details: subject=${subject}, recipient=${recipient}`
            );

            if (recipient) {
              try {
                const job = await agenda.schedule(
                  `in ${cumulativeDelay} minutes`,
                  "send email",
                  { to: recipient, subject, body }
                );
                console.log("Job scheduled successfully:", job.attrs._id);
                scheduledJobs.push(job.attrs._id.toString());
              } catch (error) {
                console.error("Failed to schedule job:", error);
              }
            } else {
              console.log("No recipient found for email");
            }
          }

          // Get next node safely
          const nextNodeId = edgeMap[currentNode.id];
          if (!nextNodeId) {
            console.log(`No next node found for ${currentNode.id}`);
            break;
          }

          const nextNode = nodeMap[nextNodeId];
          if (!nextNode) {
            console.log(`Invalid next node ID: ${nextNodeId}`);
            break;
          }

          currentNode = nextNode;
        }
      }
    }

    return scheduledJobs;
  } catch (error) {
    console.error("Error in scheduleFlowEmails:", error);
    return [];
  }
};

mongoose.connection.once("connected", async () => {
  console.log("Starting Agenda job scheduler...");
  await agenda.start();
});

export default agenda;
