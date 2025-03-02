"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KnowledgeGraph from '@/components/knowledge-graph';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/loading-screen';

// Define the case data type
interface CaseNode {
  id: string;
  type: string;
  title: string;
  summary: string;
}

interface CaseData {
  name: string;
  summary: string;
  nodes: CaseNode[];
}

export default function CasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseName = searchParams.get('name') || 'Unknown Case';
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<CaseData | null>(null);

  useEffect(() => {
    // Simulate loading and processing
    const loadData = async () => {
      // Set a minimum loading time of 3 seconds for UX purposes
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Load the pre-processed case data
      // In a real app, this would process the uploaded files
      const caseData: CaseData = {
        name: caseName,
        summary: "A detailed investigation into a potential bomb threat at Pineville Courthouse in 2023, with connections to a similar 2018 incident.",
        nodes: [
          {
            id: "events",
            type: "events",
            title: "Events/Timeline",
            summary: "On February 15, 2023, a suspicious package was discovered at Pineville Courthouse. Bomb squad was deployed at 10:15 AM and the package was safely detonated by 11:30 AM. Security footage showed a male suspect placing the package at 9:03 AM.",
          },
          {
            id: "people",
            type: "people",
            title: "People Involved",
            summary: "Main suspect: John Doe, 35, with previous record of threats. Eyewitness Jane Smith reported seeing him near the scene. Security guard Michael Johnson discovered the package. Judge Patricia Williams was handling a high-profile case that day.",
          },
          {
            id: "documents",
            type: "documents",
            title: "Documents & Evidence",
            summary: "Police report filed by Officer Rodriguez. Security footage from three angles. Forensic analysis of device components showing similarities to a 2018 device. Witness statements from courthouse staff and visitors.",
          },
          {
            id: "similar",
            type: "similar",
            title: "Similar Cases",
            summary: "2018 Pineville Courthouse bomb attempt with matching explosive signature. 2021 Government building threat in neighboring county (different method). Three other courthouse threats nationwide with similar timing patterns.",
          }
        ]
      };
      
      setGraphData(caseData);
      setLoading(false);
    };

    loadData();
  }, [caseName]);

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-primary p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trace</h1>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-primary-foreground hover:text-primary"
            onClick={handleBackToHome}
          >
            Back to Home
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto flex-1 p-4">
        <h2 className="text-3xl font-bold mb-6">{caseName}</h2>
        <div className="bg-card rounded-lg shadow-lg p-4 h-[calc(100vh-200px)]">
          {graphData && <KnowledgeGraph caseData={graphData} />}
        </div>
      </div>
    </main>
  );
} 