-- CreateTable
CREATE TABLE "UserNotificationPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "receiveEmailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receivePushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receiveDesktopNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotificationPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationPreferences_userId_key" ON "UserNotificationPreferences"("userId");

-- CreateIndex
CREATE INDEX "UserNotificationPreferences_userId_idx" ON "UserNotificationPreferences"("userId");

-- AddForeignKey
ALTER TABLE "UserNotificationPreferences" ADD CONSTRAINT "UserNotificationPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserPreferences"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
