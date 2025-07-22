"use client";

import React from 'react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { BarChart, Users, Target, Compass, Box, Gauge } from 'lucide-react';

interface SidebarNavProps {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

const navItems = [
    { title: "Situation Analysis", icon: BarChart },
    { title: "Markets & Customers", icon: Users },
    { title: "STP", icon: Target },
    { title: "Direction & Objectives", icon: Compass },
    { title: "Strategies & Programs", icon: Box },
    { title: "Metrics & Control", icon: Gauge },
];

export default function SidebarNav({ currentStep, setCurrentStep }: SidebarNavProps) {
    return (
        <SidebarMenu>
            {navItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        onClick={() => setCurrentStep(index)}
                        isActive={currentStep === index}
                        tooltip={{ children: item.title }}
                    >
                        <item.icon />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
