"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KnowledgeGraph from '@/components/knowledge-graph';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/loading-screen';

// Define the case data type
interface CaseNode {
  id: string;
  type: string;
  title: string;
  summary: string;
  reference?: string;
  children?: CaseNode[];
  parentId?: string;
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
  const isDbEnabled = searchParams.get('db') === '1';
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<CaseData | null>(null);

  useEffect(() => {
    // Simulate loading and processing
    const loadData = async () => {
      // Add a longer delay to ensure the loading screen steps are visible
      // This gives the loading screen enough time to show progress through multiple steps
      const loadingDuration = isDbEnabled ? 15000 : 12000;
      await new Promise(resolve => setTimeout(resolve, loadingDuration));
      
      // Load the pre-processed case data
      // In a real app, this would process the uploaded files
      const baseCaseData: CaseData = {
        name: caseName,
        summary: "Investigation into the September 11, 2001 terrorist attacks that resulted in nearly 3,000 deaths across New York, Washington D.C., and Pennsylvania.",
        nodes: [
          {
            id: "events",
            type: "events",
            title: "Timeline",
            summary: "Four hijacked planes were used in coordinated suicide attacks on the morning of September 11, 2001, targeting symbolic U.S. landmarks. The attacks began at 8:46 AM and concluded with the collapse of both World Trade Center towers by 10:28 AM.",
            reference: "/first-upload/timeline.pdf"
          },
          {
            id: "people",
            type: "people",
            title: "Osama Bin Laden",
            summary: "Founder and leader of al-Qaeda who claimed responsibility for the 9/11 attacks. He authorized and funded the operation through a network of cells and couriers. Bin Laden was located and killed in Pakistan in May 2011.",
          },
          {
            id: "alQaedaMembers",
            type: "documents",
            title: "Key Al Qaeda Members",
            summary: "The organizational structure behind the 9/11 attacks involved a sophisticated global terrorist network with key operatives fulfilling different roles in planning and executing the attacks.",
            children: [
              {
                id: "ksm",
                type: "documents",
                title: "Khalid Sheikh Mohammed",
                summary: "The principal architect of the 9/11 attacks who proposed the operational concept to bin Laden in 1996. He coordinated the training of hijackers and oversaw logistical details of the operation. Captured in Pakistan in 2003.",
                parentId: "alQaedaMembers"
              },
              {
                id: "atta",
                type: "documents",
                title: "Mohamed Atta",
                summary: "The tactical leader of the 9/11 hijackers who piloted American Airlines Flight 11 into the North Tower. He coordinated the hijacker teams in the U.S. and maintained communication with al-Qaeda leadership.",
                parentId: "alQaedaMembers"
              },
              {
                id: "alQahtani",
                type: "documents",
                title: "Mohammed al-Qahtani",
                summary: "Suspected to be the '20th hijacker' who was denied entry to the United States in August 2001. Intelligence suggests he was meant to join the Flight 93 team. His suspicious behavior triggered enhanced screening at Orlando airport.",
                parentId: "alQaedaMembers"
              },
              {
                id: "alKuwaiti",
                type: "documents",
                title: "Abu Ahmed al-Kuwaiti",
                summary: "Bin Laden's trusted courier whose communications patterns eventually led to locating bin Laden's compound in Abbottabad, Pakistan. His identification in 2007 proved crucial to the intelligence operation that ended in Operation Neptune Spear.",
                parentId: "alQaedaMembers"
              }
            ]
          },
          {
            id: "ciaInvestigation",
            type: "similar",
            title: "CIA Investigation",
            summary: "One of history's largest intelligence operations that identified the perpetrators and their support networks. Key breakthroughs included tracking bin Laden's courier network and revealing critical pre-attack intelligence failures.",
          }
        ]
      };
      
      // Add extra information if database search is enabled
      if (isDbEnabled) {
        // Add additional nodes or enhance existing ones
        const enhancedNodes = [...baseCaseData.nodes];
        
        // Add an additional similar case node
        enhancedNodes.push({
          id: "historical",
          type: "similar",
          title: "Historical Connection",
          summary: "Analysis revealed connections between 9/11 and earlier al-Qaeda operations including the 1993 World Trade Center bombing and 2000 USS Cole attack, showing the evolution from conventional explosives to using aircraft as weapons."
        });
        
        // Enhance the summary with database information
        const enhancedSummary = baseCaseData.summary + " The investigation led to fundamental changes in US national security, foreign policy, and counterterrorism strategy.";
        
        setGraphData({
          ...baseCaseData,
          summary: enhancedSummary,
          nodes: enhancedNodes
        });
      } else {
        // Keep the original structure with parent-child relationships
        setGraphData(baseCaseData);
      }
      
      setLoading(false);
    };

    loadData();
  }, [caseName, isDbEnabled]);

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
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">{caseName}</h2>
          {isDbEnabled && (
            <Badge variant="secondary" className="ml-2">
              Database Enhanced
            </Badge>
          )}
        </div>
        <div className="bg-card rounded-lg shadow-lg p-4 h-[calc(100vh-200px)]">
          {graphData && <KnowledgeGraph caseData={graphData} />}
        </div>
      </div>
    </main>
  );
} 