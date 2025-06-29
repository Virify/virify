-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
