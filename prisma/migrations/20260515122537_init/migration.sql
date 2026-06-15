-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "partners";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sales";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'FACILITY_STAFF', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "partners"."FacilityStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'EMERGENCY_SHUTDOWN');

-- CreateEnum
CREATE TYPE "partners"."MediaType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "partners"."TicketType" AS ENUM ('ADULT', 'CHILD', 'SENIOR', 'STUDENT', 'FAMILY_BUNDLE', 'SUMMER_PASS');

-- CreateEnum
CREATE TYPE "partners"."ValidityType" AS ENUM ('FIXED_DATE', 'FLEXIBLE_30_DAY', 'SUMMER_SEASON');

-- CreateEnum
CREATE TYPE "sales"."TicketStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'CREDIT_ELIGIBLE', 'HOLD');

-- CreateEnum
CREATE TYPE "partners"."AmenityValueType" AS ENUM ('QUANTIFIABLE', 'BOOLEAN', 'TEXT');

-- CreateEnum
CREATE TYPE "partners"."DayType" AS ENUM ('WEEKDAY', 'WEEKEND', 'HOLIDAY', 'ALL');

-- CreateEnum
CREATE TYPE "partners"."TimeSlot" AS ENUM ('FULL_DAY', 'AFTER_16H', 'THREE_HOUR');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "status" "partners"."FacilityStatus" NOT NULL DEFAULT 'DRAFT',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "descriptionSr" TEXT,
    "publicPhone" TEXT,
    "publicEmail" TEXT,
    "socialLinks" JSONB,
    "emergencyMessage" TEXT,
    "seoArticle" TEXT,
    "transitGuide" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."FacilityClosure" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilityClosure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Waves',
    "category" TEXT,
    "isSeeded" BOOLEAN NOT NULL DEFAULT false,
    "type" "partners"."AmenityValueType" NOT NULL DEFAULT 'BOOLEAN',

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."FacilityAmenity" (
    "facilityId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "value" TEXT,
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilityAmenity_pkey" PRIMARY KEY ("facilityId","amenityId")
);

-- CreateTable
CREATE TABLE "partners"."AmenityAuditLog" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmenityAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."FacilityMedia" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "type" "partners"."MediaType" NOT NULL DEFAULT 'PHOTO',
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilityMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."OperatingHours" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OperatingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."FacilityPolicy" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "faq" TEXT,

    CONSTRAINT "FacilityPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."PayoutProfile" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "stripeAccountId" TEXT,
    "commissionRate" DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    "bankName" TEXT,
    "iban" TEXT,

    CONSTRAINT "PayoutProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."FacilityCity" (
    "facilityId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FacilityCity_pkey" PRIMARY KEY ("facilityId","cityId")
);

-- CreateTable
CREATE TABLE "partners"."Ticket" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "partners"."TicketType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'RSD',
    "validityType" "partners"."ValidityType" NOT NULL,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "peoplePerTicket" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "saleStart" TIMESTAMP(3),
    "saleEnd" TIMESTAMP(3),
    "description" TEXT,
    "descriptionSr" TEXT,
    "titleSr" TEXT,
    "imageUrl" TEXT,
    "finePrint" TEXT,
    "internalSku" TEXT,
    "minPurchase" INTEGER NOT NULL DEFAULT 1,
    "maxPurchase" INTEGER,
    "requiresIdentity" BOOLEAN NOT NULL DEFAULT false,
    "requiresPhoto" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."TicketGroup" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleSr" TEXT,
    "description" TEXT,
    "descriptionSr" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners"."TicketTier" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelSr" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "dayType" "partners"."DayType",
    "timeSlot" "partners"."TimeSlot",
    "minPeople" INTEGER NOT NULL DEFAULT 1,
    "maxPeople" INTEGER,
    "isSeasonPass" BOOLEAN NOT NULL DEFAULT false,
    "seasonStart" TIMESTAMP(3),
    "seasonEnd" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minPurchase" INTEGER NOT NULL DEFAULT 1,
    "maxPurchase" INTEGER,
    "requiresIdentity" BOOLEAN NOT NULL DEFAULT false,
    "requiresPhoto" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "facilityId" TEXT NOT NULL,
    "stripeSession" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RSD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "receiptPdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfillmentError" JSONB,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."IssuedTicket" (
    "id" TEXT NOT NULL,
    "qrHash" TEXT NOT NULL,
    "ticketId" TEXT,
    "transactionId" TEXT NOT NULL,
    "status" "sales"."TicketStatus" NOT NULL DEFAULT 'ACTIVE',
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "usageLimit" INTEGER NOT NULL DEFAULT 1,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "holderName" TEXT,
    "holderPhotoUrl" TEXT,
    "ticketTierId" TEXT,
    "ticketGroupId" TEXT,

    CONSTRAINT "IssuedTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT,

    CONSTRAINT "subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_slug_key" ON "partners"."Facility"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "partners"."Amenity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityPolicy_facilityId_key" ON "partners"."FacilityPolicy"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutProfile_facilityId_key" ON "partners"."PayoutProfile"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutProfile_stripeAccountId_key" ON "partners"."PayoutProfile"("stripeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "partners"."City"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_slug_key" ON "partners"."Ticket"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TicketGroup_slug_key" ON "partners"."TicketGroup"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripeSession_key" ON "sales"."Transaction"("stripeSession");

-- CreateIndex
CREATE UNIQUE INDEX "IssuedTicket_qrHash_key" ON "sales"."IssuedTicket"("qrHash");

-- CreateIndex
CREATE UNIQUE INDEX "subscriber_email_key" ON "subscriber"("email");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityClosure" ADD CONSTRAINT "FacilityClosure_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityAmenity" ADD CONSTRAINT "FacilityAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "partners"."Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityAmenity" ADD CONSTRAINT "FacilityAmenity_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."AmenityAuditLog" ADD CONSTRAINT "AmenityAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityMedia" ADD CONSTRAINT "FacilityMedia_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."OperatingHours" ADD CONSTRAINT "OperatingHours_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityPolicy" ADD CONSTRAINT "FacilityPolicy_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."PayoutProfile" ADD CONSTRAINT "PayoutProfile_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityCity" ADD CONSTRAINT "FacilityCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "partners"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."FacilityCity" ADD CONSTRAINT "FacilityCity_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."Ticket" ADD CONSTRAINT "Ticket_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."TicketGroup" ADD CONSTRAINT "TicketGroup_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners"."TicketTier" ADD CONSTRAINT "TicketTier_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "partners"."TicketGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."Transaction" ADD CONSTRAINT "Transaction_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "partners"."Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."IssuedTicket" ADD CONSTRAINT "IssuedTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "partners"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."IssuedTicket" ADD CONSTRAINT "IssuedTicket_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "sales"."Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."IssuedTicket" ADD CONSTRAINT "IssuedTicket_ticketTierId_fkey" FOREIGN KEY ("ticketTierId") REFERENCES "partners"."TicketTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."IssuedTicket" ADD CONSTRAINT "IssuedTicket_ticketGroupId_fkey" FOREIGN KEY ("ticketGroupId") REFERENCES "partners"."TicketGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
