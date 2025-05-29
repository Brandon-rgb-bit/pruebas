// js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gsqkuontdiijqcdbjkrd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcWt1b250ZGlpanFjZGJqa3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MzQxMDgsImV4cCI6MjA2MTMxMDEwOH0.r9XUcUEvnop6EgpaIygPleM1avym7lR7xWpjocRznwY';

export const supabase = createClient(supabaseUrl, supabaseKey);
