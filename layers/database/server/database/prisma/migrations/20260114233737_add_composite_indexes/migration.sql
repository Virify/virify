-- CreateIndex
CREATE INDEX "Conversation_id_senderId_idx" ON "Conversation"("id", "senderId");

-- CreateIndex
CREATE INDEX "Conversation_id_receiverId_idx" ON "Conversation"("id", "receiverId");

-- CreateIndex
CREATE INDEX "Listing_estateAgentId_idx" ON "Listing"("estateAgentId");

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE INDEX "Property_estateAgentId_idx" ON "Property"("estateAgentId");

-- CreateIndex
CREATE INDEX "Property_propertyTypeId_idx" ON "Property"("propertyTypeId");

-- CreateIndex
CREATE INDEX "Property_propertyClassificationId_idx" ON "Property"("propertyClassificationId");
