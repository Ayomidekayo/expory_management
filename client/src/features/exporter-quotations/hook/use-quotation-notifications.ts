
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectQuotationSocket } from "../../lib/quotation-socket";


export function useQuotationNotifications(token: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const socket = connectQuotationSocket(token);

    const onSubmitted = (event: {
      submissionId: string;
      quoteId: string;
      status: string;
      submittedAt: string;
    }) => {
      // Refresh the admin table immediately.
      void queryClient.invalidateQueries({
        queryKey: ["admin", "quotations"],
      });

      // Browser notification is optional; the app should still work
      // if the user hasn't granted notification permission.
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("New quotation submission", {
          body: `A new quotation submission needs review.`,
        });
      }

      console.info("New quotation submission:", event.submissionId);
    };

    socket.on("quotation:submitted", onSubmitted);

    return () => {
      socket.off("quotation:submitted", onSubmitted);
      // Do not disconnect here if other components share this socket.
    };
  }, [token, queryClient]);
}
