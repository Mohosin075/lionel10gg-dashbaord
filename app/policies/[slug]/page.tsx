import React from "react";
import { Metadata } from "next";
import { POLICY_DEFINITIONS, PolicyDefinition, findPolicyDefinition } from "@/lib/policyTemplates";
import PublicPolicyClient from "./PublicPolicyClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch dynamic policy data from backend API with fallback
async function fetchPolicyData(slug: string) {
  const backendUrl = (
    process.env.NEXT_PUBLIC_BASEURL || "http://localhost:5005"
  ).replace(/\/$/, "");

  const matchedDef: PolicyDefinition = findPolicyDefinition(slug);

  try {
    const res = await fetch(`${backendUrl}/api/v1/public/${slug}`, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.content) {
        return {
          title: data.data.title || matchedDef.title,
          content: data.data.content,
          type: data.data.type || slug,
          lastUpdated:
            data.data.lastUpdated ||
            data.data.updatedAt ||
            new Date().toISOString(),
          isDefault: data.data.isDefault ?? false,
          category: matchedDef.category,
        };
      }
    }
  } catch (error) {
    // Graceful fallback to static template
  }

  return {
    title: matchedDef.title,
    content: matchedDef.defaultContent,
    type: matchedDef.type,
    lastUpdated: new Date().toISOString(),
    isDefault: true,
    category: matchedDef.category,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = await fetchPolicyData(slug);
  return {
    title: `${policy.title} - Quran International`,
    description: `Official ${policy.title} for Quran International application. Compliant with Google Play Store and Apple App Store.`,
  };
}

export default async function PublicPolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = await fetchPolicyData(slug);

  return <PublicPolicyClient policy={policy} slug={slug} />;
}
