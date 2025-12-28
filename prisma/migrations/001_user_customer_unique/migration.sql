-- Add unique constraint for one-to-one User -> Customer
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");
