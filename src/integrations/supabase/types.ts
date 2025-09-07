export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          author_name: string
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          published_at: string | null
          read_time_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published_at?: string | null
          read_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published_at?: string | null
          read_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          subject_id: string
          subject_type: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          subject_id: string
          subject_type: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          subject_id?: string
          subject_type?: string
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_user_id: string
          blocker_user_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_user_id: string
          blocker_user_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_user_id?: string
          blocker_user_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          body: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      budget_items: {
        Row: {
          actual_amount: number | null
          booked_amount: number | null
          budget_id: string
          category: string
          created_at: string
          id: string
          notes: string | null
          planned_amount: number | null
          status: string | null
          updated_at: string
          vendor_contact: string | null
          vendor_name: string | null
        }
        Insert: {
          actual_amount?: number | null
          booked_amount?: number | null
          budget_id: string
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          planned_amount?: number | null
          status?: string | null
          updated_at?: string
          vendor_contact?: string | null
          vendor_name?: string | null
        }
        Update: {
          actual_amount?: number | null
          booked_amount?: number | null
          budget_id?: string
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          planned_amount?: number | null
          status?: string | null
          updated_at?: string
          vendor_contact?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          id: string
          name: string
          total_budget: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          total_budget?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          total_budget?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborators: {
        Row: {
          created_at: string
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          invitee_email: string
          invitee_user_id: string | null
          inviter_user_id: string
          permissions: Json | null
          role: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invitee_email: string
          invitee_user_id?: string | null
          inviter_user_id: string
          permissions?: Json | null
          role: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invitee_email?: string
          invitee_user_id?: string | null
          inviter_user_id?: string
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          subject_id: string
          subject_type: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          subject_id: string
          subject_type: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          subject_id?: string
          subject_type?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      feedback_messages: {
        Row: {
          category: string | null
          created_at: string
          email: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gift_registries: {
        Row: {
          contributors: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          purchased_amount: number | null
          sort_order: number | null
          target_amount: number | null
          title: string
          type: string
          url: string | null
          user_id: string
          wedding_id: string | null
        }
        Insert: {
          contributors?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          purchased_amount?: number | null
          sort_order?: number | null
          target_amount?: number | null
          title: string
          type: string
          url?: string | null
          user_id: string
          wedding_id?: string | null
        }
        Update: {
          contributors?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          purchased_amount?: number | null
          sort_order?: number | null
          target_amount?: number | null
          title?: string
          type?: string
          url?: string | null
          user_id?: string
          wedding_id?: string | null
        }
        Relationships: []
      }
      guest_list: {
        Row: {
          created_at: string | null
          dietary: string | null
          email: string | null
          full_name: string
          group_name: string | null
          id: string
          notes: string | null
          phone: string | null
          rsvp_status: string | null
          side: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dietary?: string | null
          email?: string | null
          full_name: string
          group_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          rsvp_status?: string | null
          side?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dietary?: string | null
          email?: string | null
          full_name?: string
          group_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          rsvp_status?: string | null
          side?: string | null
          user_id?: string
        }
        Relationships: []
      }
      guest_list_items: {
        Row: {
          created_at: string
          dietary_requirements: string | null
          guest_list_id: string
          id: string
          name: string
          notes: string | null
          rsvp_status: string | null
          side: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dietary_requirements?: string | null
          guest_list_id: string
          id?: string
          name: string
          notes?: string | null
          rsvp_status?: string | null
          side?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dietary_requirements?: string | null
          guest_list_id?: string
          id?: string
          name?: string
          notes?: string | null
          rsvp_status?: string | null
          side?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_list_items_guest_list_id_fkey"
            columns: ["guest_list_id"]
            isOneToOne: false
            referencedRelation: "guest_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_lists: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          group_name: string | null
          id: string
          invite_sent: boolean | null
          notes: string | null
          phone: string | null
          rsvp_status: string | null
          side: string | null
          user_id: string
          wedding_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          group_name?: string | null
          id?: string
          invite_sent?: boolean | null
          notes?: string | null
          phone?: string | null
          rsvp_status?: string | null
          side?: string | null
          user_id: string
          wedding_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          group_name?: string | null
          id?: string
          invite_sent?: boolean | null
          notes?: string | null
          phone?: string | null
          rsvp_status?: string | null
          side?: string | null
          user_id?: string
          wedding_id?: string | null
        }
        Relationships: []
      }
      interests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["interest_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["interest_status"]
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["interest_status"]
        }
        Relationships: [
          {
            foreignKeyName: "interests_from_user_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interests_to_user_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          canva_link: string | null
          created_at: string
          custom_message: string | null
          event_date: string | null
          exported_file_url: string | null
          guest_names: string[] | null
          id: string
          template_name: string
          updated_at: string
          user_id: string
          venue_name: string | null
        }
        Insert: {
          canva_link?: string | null
          created_at?: string
          custom_message?: string | null
          event_date?: string | null
          exported_file_url?: string | null
          guest_names?: string[] | null
          id?: string
          template_name: string
          updated_at?: string
          user_id: string
          venue_name?: string | null
        }
        Update: {
          canva_link?: string | null
          created_at?: string
          custom_message?: string | null
          event_date?: string | null
          exported_file_url?: string | null
          guest_names?: string[] | null
          id?: string
          template_name?: string
          updated_at?: string
          user_id?: string
          venue_name?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          from_user_id: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string | null
          supplier_id: string
        }
        Insert: {
          created_at?: string
          email: string
          from_user_id?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string | null
          supplier_id: string
        }
        Update: {
          created_at?: string
          email?: string
          from_user_id?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      member_profiles: {
        Row: {
          bio: string | null
          community_caste: string | null
          created_at: string
          date_of_birth: string | null
          education: string | null
          gender: string | null
          height_cm: number | null
          id: string
          immigration_status:
            | Database["public"]["Enums"]["immigration_status"]
            | null
          manager_id: string | null
          mother_tongue: string | null
          photos: string[] | null
          preferences: Json | null
          profession: string | null
          religion: string | null
          relocate_willing: boolean | null
          updated_at: string
          user_id: string
          verified: boolean | null
          visibility: string | null
        }
        Insert: {
          bio?: string | null
          community_caste?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          immigration_status?:
            | Database["public"]["Enums"]["immigration_status"]
            | null
          manager_id?: string | null
          mother_tongue?: string | null
          photos?: string[] | null
          preferences?: Json | null
          profession?: string | null
          religion?: string | null
          relocate_willing?: boolean | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          visibility?: string | null
        }
        Update: {
          bio?: string | null
          community_caste?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          immigration_status?:
            | Database["public"]["Enums"]["immigration_status"]
            | null
          manager_id?: string | null
          mother_tongue?: string | null
          photos?: string[] | null
          preferences?: Json | null
          profession?: string | null
          religion?: string | null
          relocate_willing?: boolean | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          title: string
        }
        Insert: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          title: string
        }
        Update: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      recovery_codes: {
        Row: {
          code_hash: string
          created_at: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_user_id: string
          status: string
          subject_id: string
          subject_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_user_id: string
          status?: string
          subject_id: string
          subject_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_user_id?: string
          status?: string
          subject_id?: string
          subject_type?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string | null
          author_name: string
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subject_id: string
          subject_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subject_id: string
          subject_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subject_id?: string
          subject_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_leads: {
        Row: {
          budget_range: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          event_date: string | null
          follow_up_date: string | null
          id: string
          message: string | null
          notes: string | null
          priority: string | null
          source: string | null
          status: string | null
          supplier_id: string
          updated_at: string
          value_estimate: number | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          event_date?: string | null
          follow_up_date?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          supplier_id: string
          updated_at?: string
          value_estimate?: number | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          event_date?: string | null
          follow_up_date?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          supplier_id?: string
          updated_at?: string
          value_estimate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_leads_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_pages: {
        Row: {
          about_section: string | null
          banner_url: string | null
          contact_form_enabled: boolean | null
          created_at: string
          custom_css: string | null
          gallery_images: string[] | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          packages: Json | null
          seo_description: string | null
          seo_title: string | null
          services_section: string | null
          slug: string
          supplier_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          about_section?: string | null
          banner_url?: string | null
          contact_form_enabled?: boolean | null
          created_at?: string
          custom_css?: string | null
          gallery_images?: string[] | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          packages?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          services_section?: string | null
          slug: string
          supplier_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          about_section?: string | null
          banner_url?: string | null
          contact_form_enabled?: boolean | null
          created_at?: string
          custom_css?: string | null
          gallery_images?: string[] | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          packages?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          services_section?: string | null
          slug?: string
          supplier_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_pages_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          supplier_id: string
          viewer_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          supplier_id: string
          viewer_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          supplier_id?: string
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_views_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          business_name: string
          capacity_max: number | null
          capacity_min: number | null
          categories: string[]
          city: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          photos: string[] | null
          plan: Database["public"]["Enums"]["supplier_plan"]
          price_band: string | null
          rating: number | null
          regions: string[] | null
          socials: Json | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          business_name: string
          capacity_max?: number | null
          capacity_min?: number | null
          categories?: string[]
          city: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          photos?: string[] | null
          plan?: Database["public"]["Enums"]["supplier_plan"]
          price_band?: string | null
          rating?: number | null
          regions?: string[] | null
          socials?: Json | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          business_name?: string
          capacity_max?: number | null
          capacity_min?: number | null
          categories?: string[]
          city?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          photos?: string[] | null
          plan?: Database["public"]["Enums"]["supplier_plan"]
          price_band?: string | null
          rating?: number | null
          regions?: string[] | null
          socials?: Json | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_items: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          profile_visibility: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          profile_visibility?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          profile_visibility?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          name: string
          partner_name: string | null
          phone: string | null
          plan: string | null
          planning_phase: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_tier: string | null
          two_factor_backup_codes: string[] | null
          two_factor_enabled: boolean | null
          updated_at: string
          venue_location: string | null
          wedding_date: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          partner_name?: string | null
          phone?: string | null
          plan?: string | null
          planning_phase?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_tier?: string | null
          two_factor_backup_codes?: string[] | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          venue_location?: string | null
          wedding_date?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          partner_name?: string | null
          phone?: string | null
          plan?: string | null
          planning_phase?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_tier?: string | null
          two_factor_backup_codes?: string[] | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          venue_location?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      wedding_timeline_items: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_on: string
          id: string
          priority: string | null
          sort_order: number | null
          status: string | null
          title: string
          user_id: string
          wedding_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_on: string
          id?: string
          priority?: string | null
          sort_order?: number | null
          status?: string | null
          title: string
          user_id: string
          wedding_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_on?: string
          id?: string
          priority?: string | null
          sort_order?: number | null
          status?: string | null
          title?: string
          user_id?: string
          wedding_id?: string | null
        }
        Relationships: []
      }
      weddings: {
        Row: {
          created_at: string
          event_date: string | null
          id: string
          partner_name: string | null
          timezone: string | null
          user_id: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          id?: string
          partner_name?: string | null
          timezone?: string | null
          user_id: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          event_date?: string | null
          id?: string
          partner_name?: string | null
          timezone?: string | null
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      immigration_status:
        | "citizen"
        | "permanent_resident"
        | "temporary_visa"
        | "student_visa"
        | "work_visa"
        | "other"
      interest_status: "pending" | "accepted" | "declined"
      supplier_plan: "free" | "featured" | "premium"
      user_role: "guest" | "member" | "parent" | "supplier" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      immigration_status: [
        "citizen",
        "permanent_resident",
        "temporary_visa",
        "student_visa",
        "work_visa",
        "other",
      ],
      interest_status: ["pending", "accepted", "declined"],
      supplier_plan: ["free", "featured", "premium"],
      user_role: ["guest", "member", "parent", "supplier", "admin"],
    },
  },
} as const
