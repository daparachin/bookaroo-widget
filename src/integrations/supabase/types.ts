export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      booking: {
        Row: {
          basePrice: number | null
          checkIn: string
          checkOut: string
          cleaningFee: number | null
          created_at: string
          discount: number | null
          id: string
          propertyId: string
          seasonalAdjustment: number | null
          serviceFee: number | null
          status: Database["public"]["Enums"]["BookingStatus"]
          totalPrice: number | null
          userId: string
        }
        Insert: {
          basePrice?: number | null
          checkIn: string
          checkOut: string
          cleaningFee?: number | null
          created_at?: string
          discount?: number | null
          id?: string
          propertyId: string
          seasonalAdjustment?: number | null
          serviceFee?: number | null
          status?: Database["public"]["Enums"]["BookingStatus"]
          totalPrice?: number | null
          userId: string
        }
        Update: {
          basePrice?: number | null
          checkIn?: string
          checkOut?: string
          cleaningFee?: number | null
          created_at?: string
          discount?: number | null
          id?: string
          propertyId?: string
          seasonalAdjustment?: number | null
          serviceFee?: number | null
          status?: Database["public"]["Enums"]["BookingStatus"]
          totalPrice?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      Booking: {
        Row: {
          checkIn: string
          checkOut: string
          createdAt: string
          id: string
          propertyId: string
          status: Database["public"]["Enums"]["BookingStatus"]
          userId: string
        }
        Insert: {
          checkIn: string
          checkOut: string
          createdAt?: string
          id: string
          propertyId: string
          status?: Database["public"]["Enums"]["BookingStatus"]
          userId: string
        }
        Update: {
          checkIn?: string
          checkOut?: string
          createdAt?: string
          id?: string
          propertyId?: string
          status?: Database["public"]["Enums"]["BookingStatus"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Booking_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "Property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number
          bookingId: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          userId: string
        }
        Insert: {
          amount: number
          bookingId: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          userId: string
        }
        Update: {
          amount?: number
          bookingId?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: true
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      Payment: {
        Row: {
          amount: number
          bookingId: string
          createdAt: string
          id: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          userId: string
        }
        Insert: {
          amount: number
          bookingId: string
          createdAt?: string
          id: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          userId: string
        }
        Update: {
          amount?: number
          bookingId?: string
          createdAt?: string
          id?: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Payment_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: false
            referencedRelation: "Booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Payment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      property: {
        Row: {
          created_at: string
          extendedStayDiscounts: Json | null
          id: string
          location: string
          name: string
          ownerId: string
          pricePerNight: number
          seasonalPricing: Json | null
        }
        Insert: {
          created_at?: string
          extendedStayDiscounts?: Json | null
          id?: string
          location: string
          name: string
          ownerId: string
          pricePerNight: number
          seasonalPricing?: Json | null
        }
        Update: {
          created_at?: string
          extendedStayDiscounts?: Json | null
          id?: string
          location?: string
          name?: string
          ownerId?: string
          pricePerNight?: number
          seasonalPricing?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "property_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      Property: {
        Row: {
          createdAt: string
          id: string
          location: string
          name: string
          ownerId: string
          pricePerNight: number
        }
        Insert: {
          createdAt?: string
          id: string
          location: string
          name: string
          ownerId: string
          pricePerNight: number
        }
        Update: {
          createdAt?: string
          id?: string
          location?: string
          name?: string
          ownerId?: string
          pricePerNight?: number
        }
        Relationships: [
          {
            foreignKeyName: "Property_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      property_availability: {
        Row: {
          booking_id: string | null
          date: string
          id: string
          price: number | null
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          date: string
          id?: string
          price?: number | null
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          date?: string
          id?: string
          price?: number | null
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_availability_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_availability_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
        Relationships: []
      }
      User: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
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
      BookingStatus: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED"
      PaymentStatus: "PENDING" | "COMPLETED" | "FAILED"
      Role: "USER" | "ADMIN" | "OWNER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
