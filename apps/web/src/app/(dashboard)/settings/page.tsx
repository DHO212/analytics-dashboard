"use client";

import { motion } from "motion/react";
import { User, Bell, Palette, Shield, Database } from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/page-header";

const settingsSections = [
  { icon: User, title: "Profile", description: "Manage your account details and preferences" },
  { icon: Bell, title: "Notifications", description: "Configure notification channels and preferences" },
  { icon: Palette, title: "Appearance", description: "Customize theme and display settings" },
  { icon: Shield, title: "Security", description: "Manage password, sessions, and API keys" },
  { icon: Database, title: "Data Sources", description: "Configure database connections and data pipelines" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your dashboard configuration and preferences"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section, i) => (
          <motion.button
            key={section.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.05 }}
            className="widget text-left hover:border-indigo-500/30 transition-colors"
          >
            <section.icon size={24} className="text-[rgb(var(--text-2))] mb-3" />
            <h3 className="text-sm font-semibold text-[rgb(var(--text))]">{section.title}</h3>
            <p className="mt-1 text-xs text-[rgb(var(--text-2))]">{section.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
