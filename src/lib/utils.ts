import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Fetch recent vulnerabilities from the CVE API (public)
export async function fetchRecentVulnerabilities() {
    try {
        const res = await fetch('http://localhost:4000/cve');
        if (!res.ok) throw new Error('Failed to fetch CVEs');
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error('CVE data is not an array');
        }
        // Map to a simplified format for the UI
        return data.map((item: any, i: number) => ({
            id: item.id || `cve-${i}`,
            timestamp: item.Published || new Date().toISOString(),
            type: item.summary ? item.summary.split(' ')[0] : 'Vulnerability',
            source: item.cvss ? `CVSS: ${item.cvss}` : 'Unknown',
            severity: item.cvss >= 7 ? 'High' : item.cvss >= 4 ? 'Medium' : 'Low',
            status: 'Active',
            impact: item.cvss || 0,
            title: item.id,
            description: item.summary || '',
            references: Array.isArray(item.references)
                ? item.references.map((ref: any) =>
                    typeof ref === 'string'
                        ? ref
                        : (ref && typeof ref.url === 'string'
                            ? ref.url
                            : '')
                ).filter(Boolean)
                : [],
        }));
    } catch (e) {
        // Fallback to mock data
        return Array.from({ length: 8 }, (_, i) => ({
            id: `mock-cve-${i}`,
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            type: 'MockVuln',
            source: 'Simulated',
            severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            status: 'Active',
            impact: Math.floor(Math.random() * 10),
            title: `Mock Vulnerability ${i + 1}`,
            description: 'This is a simulated vulnerability for demo purposes.',
            references: [],
        }));
    }
}
