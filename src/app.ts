import express, { Application, Request, Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import config from "./config"
import router from "./routes"
import { notFound } from "./middlewares/notFound"
import { globalErrorHandler } from "./middlewares/globalErrorHandler"
import { swaggerSpec } from "./docs/swagger"

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

// Stripe webhook needs the RAW body to verify the signature,
// so it is registered BEFORE express.json() parses anything.
app.use("/api/payments/webhook", express.raw({ type: "application/json" }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// health check
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "FixItNow API is running 🔧",
        documentation: "/api-docs"
    })
})

// OpenAPI spec + Swagger UI (served from CDN so no extra dependency is needed)
app.get("/api-docs.json", (req: Request, res: Response) => {
    res.status(200).json(swaggerSpec)
})

app.get("/api-docs", (req: Request, res: Response) => {
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FixItNow API Docs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/api-docs.json",
          dom_id: "#swagger-ui",
          persistAuthorization: true
        });
      };
    </script>
  </body>
</html>`)
})

// all API routes
app.use("/api", router)

// 404 handler
app.use(notFound)

// structured error handler - always returns { success, message, errorDetails }
app.use(globalErrorHandler)

export default app;
