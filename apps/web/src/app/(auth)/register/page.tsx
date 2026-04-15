"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(1, "Введіть ім'я").min(2, "Ім'я має містити мінімум 2 символи"),
    email: z.string().min(1, "Введіть email").email("Невалідний формат email"),
    password: z
      .string()
      .min(1, "Введіть пароль")
      .min(8, "Пароль має містити мінімум 8 символів")
      .regex(/[A-Z]/, "Потрібна хоча б одна велика літера")
      .regex(/[0-9]/, "Потрібна хоча б одна цифра"),
    confirmPassword: z.string().min(1, "Підтвердіть пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>⚠ {error}</p>
      )}
    </div>
  );
}

const inputWrap = (hasError: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  border: `1px solid ${hasError ? "#f87171" : "#d1d5db"}`,
  borderRadius: 8,
  padding: "0 12px",
  background: hasError ? "#fff7f7" : "#fff",
  height: 42,
});

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 14,
  fontFamily: "inherit",
  background: "transparent",
  color: "#111827",
};

export default function RegisterPage() {
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsPending(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      console.log("POST /auth/register →", data);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 140px)",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "48px 16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: "40px 32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>
            Реєстрація
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            Створіть обліковий запис
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Field label="Ім'я та прізвище" error={errors.name?.message}>
            <div style={inputWrap(!!errors.name)}>
              <User size={15} color="#9ca3af" />
              <input
                {...register("name")}
                type="text"
                placeholder="Іван Петренко"
                autoComplete="name"
                style={inputStyle}
              />
            </div>
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <div style={inputWrap(!!errors.email)}>
              <Mail size={15} color="#9ca3af" />
              <input
                {...register("email")}
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                style={inputStyle}
              />
            </div>
          </Field>

          <Field label="Пароль" error={errors.password?.message}>
            <div style={inputWrap(!!errors.password)}>
              <Lock size={15} color="#9ca3af" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Мінімум 8 символів"
                autoComplete="new-password"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#9ca3af" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field label="Підтвердження пароля" error={errors.confirmPassword?.message}>
            <div style={inputWrap(!!errors.confirmPassword)}>
              <Lock size={15} color="#9ca3af" />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Повторіть пароль"
                autoComplete="new-password"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#9ca3af" }}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: 4,
              width: "100%",
              background: isPending ? "#9ca3af" : "#111827",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              padding: "12px",
              border: "none",
              cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {isPending ? "Реєстрація…" : "Зареєструватися"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 20 }}>
          Вже є акаунт?{" "}
          <Link href="/login" style={{ color: "#111827", fontWeight: 500 }}>
            Увійти
          </Link>
        </p>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
          Пароль: мін. 8 символів, одна велика літера та цифра
        </p>
      </div>
    </div>
  );
}