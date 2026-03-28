-- 既存の tournaments テーブルに外部申し込み URL カラムを追加
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS external_registration_url TEXT;
