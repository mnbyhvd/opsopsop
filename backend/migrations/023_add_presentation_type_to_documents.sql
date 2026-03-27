-- Migration 023: Add 'presentation' type to documents table
-- Adds presentation as a new document type alongside document and certificate

ALTER TABLE documents
  MODIFY COLUMN type ENUM('document', 'certificate', 'presentation') NOT NULL DEFAULT 'document';
