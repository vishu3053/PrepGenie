/** @type {import("drizzle-kit").Config} */
export default{
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://PrepGenie_owner:c03FNoRxOQib@ep-tiny-dream-a540pte7.us-east-2.aws.neon.tech/PrepGenie?sslmode=require',
    }
};