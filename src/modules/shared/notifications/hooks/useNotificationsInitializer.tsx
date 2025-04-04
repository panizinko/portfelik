import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";
import { initializeNotifications } from "@/lib/service-worker";
import { useEffect, useState } from "react";

export function useNotificationInitializer() {
  const { currentUser, userData, isLoading } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      if (!currentUser || !userData || initialized) return;

      logger.info(
        "NotificationInitializer",
        `Setting up notifications for user: ${currentUser.uid}`,
      );

      try {
        const result = await initializeNotifications(currentUser.uid);

        if (result) {
          logger.info(
            "NotificationInitializer",
            "Notifications initialized successfully",
          );
        } else {
          logger.info(
            "NotificationInitializer",
            "Notifications not initialized (disabled or error)",
          );
        }
      } catch (error) {
        logger.error(
          "NotificationInitializer",
          "Error initializing notifications:",
          error,
        );
      } finally {
        setInitialized(true);
      }
    }

    if (!isLoading) {
      setupNotifications();
    }
  }, [currentUser, userData, isLoading, initialized]);

  return initialized;
}
