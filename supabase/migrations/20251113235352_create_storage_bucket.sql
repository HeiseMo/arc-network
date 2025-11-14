/*
  # Create Storage Bucket for Bounty Proofs

  ## Overview
  Creates a public storage bucket for storing bounty proof images and videos.

  ## New Storage
  - `bounty-proofs` bucket (public) - Stores screenshots and videos for bounty reports and confirmations

  ## Security
  - Public bucket allows read access for all users
  - Only authenticated users can upload files
  - Users can only delete their own files
*/

-- Create storage bucket for bounty proofs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bounty-proofs',
  'bounty-proofs',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload bounty proofs" ON storage.objects;
CREATE POLICY "Authenticated users can upload bounty proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bounty-proofs');

-- Allow public read access
DROP POLICY IF EXISTS "Public can view bounty proofs" ON storage.objects;
CREATE POLICY "Public can view bounty proofs"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'bounty-proofs');

-- Allow users to update their own files
DROP POLICY IF EXISTS "Users can update own bounty proofs" ON storage.objects;
CREATE POLICY "Users can update own bounty proofs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'bounty-proofs' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'bounty-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own bounty proofs" ON storage.objects;
CREATE POLICY "Users can delete own bounty proofs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'bounty-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);