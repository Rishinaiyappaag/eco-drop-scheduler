import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  orderId: string;
  status: string;
}

const getStatusMessage = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        subject: 'Order Placed Successfully',
        title: 'Your E-Waste Collection Order Has Been Placed',
        message: 'Thank you for choosing EcoDrop! Your order has been received and is pending review.'
      };
    case 'accepted':
      return {
        subject: 'Order Accepted',
        title: 'Your Order Has Been Accepted',
        message: 'Great news! Your e-waste collection order has been accepted and will be processed soon.'
      };
    case 'picked_up':
      return {
        subject: 'Order Picked Up',
        title: 'Your E-Waste Has Been Picked Up',
        message: 'Your e-waste has been successfully picked up by our team. Thank you for contributing to a greener planet!'
      };
    case 'completed':
      return {
        subject: 'Order Completed',
        title: 'Your Order Has Been Completed',
        message: 'Your e-waste recycling order has been completed successfully. Your reward points have been credited to your account!'
      };
    default:
      return {
        subject: 'Order Status Update',
        title: 'Your Order Status Has Been Updated',
        message: `Your order status has been updated to: ${status}`
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, status }: NotificationRequest = await req.json();

    console.log(`Processing notification for order ${orderId} with status ${status}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order details with user info
    const { data: orderData, error: orderError } = await supabase
      .from('e_waste_requests')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      console.error("Error fetching order:", orderError);
      throw new Error("Order not found");
    }

    const profile = orderData.profiles as any;
    if (!profile || !profile.email) {
      console.log("No email found for user, skipping notification");
      return new Response(
        JSON.stringify({ message: "No email to send to" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const statusInfo = getStatusMessage(status);
    const customerName = `${profile.first_name} ${profile.last_name}`;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "EcoDrop <onboarding@resend.dev>",
      to: [profile.email],
      subject: statusInfo.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .status-badge { display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-label { font-weight: bold; color: #6b7280; }
              .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌿 EcoDrop Scheduler</h1>
              </div>
              <div class="content">
                <h2>Hello ${customerName}!</h2>
                <p>${statusInfo.message}</p>
                
                <div class="status-badge">Status: ${status.toUpperCase()}</div>
                
                <div class="details">
                  <h3>Order Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span>${orderId.slice(0, 8)}...</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Waste Type:</span>
                    <span>${orderData.waste_type}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Pickup Date:</span>
                    <span>${new Date(orderData.pickup_time).toLocaleDateString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span>${orderData.address}</span>
                  </div>
                  ${orderData.points_awarded > 0 ? `
                  <div class="detail-row">
                    <span class="detail-label">Points Earned:</span>
                    <span style="color: #10b981; font-weight: bold;">🎉 ${orderData.points_awarded} points</span>
                  </div>
                  ` : ''}
                </div>
                
                <p>Thank you for choosing EcoDrop Scheduler and helping us create a sustainable future! 🌍</p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2025 EcoDrop Scheduler. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
