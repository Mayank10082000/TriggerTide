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
  const { nodes, edges } = flow;
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const edgeMap = new Map(edges.map((edge) => [edge.source, edge.target]));
  const scheduledJobs = [];

  // Start from all lead sources
  for (const node of nodes) {
    if (node.type === "leadSource") {
      let currentNode = node;
      let cumulativeDelay = 0;
      const visitedNodes = new Set();

      while (currentNode && !visitedNodes.has(currentNode.id)) {
        visitedNodes.add(currentNode.id);

        // Process delays
        if (currentNode.type === "waitDelay") {
          const { delayTime, delayUnit = "minutes" } = currentNode.data;
          cumulativeDelay +=
            delayUnit === "hours"
              ? delayTime * 60
              : delayUnit === "days"
              ? delayTime * 1440
              : delayTime;
        }

        // Process emails
        if (currentNode.type === "coldEmail") {
          const subject = currentNode.data.subject || "No Subject";
          const body = currentNode.data.body || "No Body";
          const recipient = node.data.email || currentNode.data.recipient;

          if (recipient) {
            const job = await agenda.schedule(
              `in ${cumulativeDelay} minutes`,
              "send email",
              { to: recipient, subject, body }
            );
            scheduledJobs.push(job.attrs._id.toString());
          }
        }

        const nextNodeId = edgeMap.get(currentNode.id);
        currentNode = nodeMap.get(nextNodeId);
      }
    }
  }

  return scheduledJobs;
};

mongoose.connection.once("connected", async () => {
  console.log("Starting Agenda job scheduler...");
  await agenda.start();
});

export default agenda;
