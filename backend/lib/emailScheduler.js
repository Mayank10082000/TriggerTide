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
  const scheduledJobs = [];

  // Find lead source nodes (starting points)
  const leadSources = nodes.filter((node) => node.type === "leadSource");

  for (const leadSource of leadSources) {
    // Start with the lead source node
    let currentNodeId = leadSource.id;
    let cumulativeDelay = 0; // in minutes

    // Process each node in the path
    while (currentNodeId) {
      // Find outgoing edge from current node
      const edge = edges.find((e) => e.source === currentNodeId);
      if (!edge) break; // End of path

      // Find the next node
      const nextNode = nodes.find((n) => n.id === edge.target);
      if (!nextNode) break; // Node not found

      // If it's a wait/delay node, add to cumulative delay
      if (nextNode.type === "waitDelay") {
        const { delayTime, delayUnit = "minutes" } = nextNode.data;

        // Convert to minutes
        if (delayUnit === "hours") {
          cumulativeDelay += delayTime * 60;
        } else if (delayUnit === "days") {
          cumulativeDelay += delayTime * 60 * 24;
        } else {
          cumulativeDelay += delayTime;
        }
      }

      // If it's an email node, schedule it
      if (nextNode.type === "coldEmail") {
        const { subject, body } = nextNode.data;

        // Use the recipient email from the lead source node
        const emailRecipient = leadSource.data && leadSource.data.email;

        if (emailRecipient) {
          // Schedule the email with the accumulated delay
          const job = await agenda.schedule(
            `in ${cumulativeDelay} minutes`,
            "send email",
            {
              to: emailRecipient,
              subject,
              body,
            }
          );

          scheduledJobs.push(job.attrs._id.toString());
        }
      }

      // Move to the next node
      currentNodeId = nextNode.id;
    }
  }

  return scheduledJobs;
};

mongoose.connection.once("connected", async () => {
  console.log("Starting Agenda job scheduler...");
  await agenda.start();
});

export default agenda;
