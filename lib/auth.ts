import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    
    trustedOrigins: [
        "https://www.splashdeals.rs",
        "https://splashdeals.rs",
        "http://localhost:3000"
    ],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,      // refresh once per day
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 min cache
        },
    },

    emailVerification: {
        sendOnSignUp: false, // No public sign-up for admin
    },

    resetPassword: {
        enabled: true,
        expiresIn: 3600, // 1 hour
        sendResetPassword: async ({ user, url }: { user: any; url: string }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your Splashdeals Admin password",
                html: `
                <html>
                  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                      <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #22d3ee; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Splashdeals <span style="color: #94a3b8;">Admin</span></h1>
                      </div>
                      <p style="font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">
                        A password reset was requested for your Splashdeals Admin account. Click the button below to set a new password. This link expires in 1 hour.
                      </p>
                      <div style="text-align: center; margin-bottom: 32px;">
                        <a href="${url}" style="display: inline-block; background-color: #22d3ee; color: #020617; padding: 14px 32px; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Reset Password</a>
                      </div>
                      <p style="font-size: 12px; color: #475569; text-align: center; margin: 0;">
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </div>
                    <div style="text-align: center; margin-top: 24px; color: #475569; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">
                      Splashdeals.rs &bull; Internal Portal
                    </div>
                  </body>
                </html>
                `,
            });
        },
    },

    rateLimit: {
        window: 60, // 60 seconds
        max: 15,    // 15 requests per window
    },
    
    // Expert addition: Map role to session for easier RBAC
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "CUSTOMER"
            }
        }
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: process.env.NODE_ENV === "production",
            domain: process.env.NODE_ENV === "production" ? ".splashdeals.rs" : undefined,
        }
    }
});

