"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

export default function Home() {
  const router = useRouter();
  const [caseName, setCaseName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleBuildCase = () => {
    // Instead of actually processing files, navigate to the case page
    router.push(`/case?name=${encodeURIComponent(caseName)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold mb-4">Trace</h1>
          <p className="text-xl text-muted-foreground">
            Interactive knowledge graph for investigative reports
          </p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>New Investigation</CardTitle>
            <CardDescription>
              Create a new investigation by entering a case name and uploading documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="caseName">Case Name</Label>
              <Input
                id="caseName"
                placeholder="Enter case name"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Upload Documents</Label>
              <FileUpload onFilesSelected={handleFilesSelected} />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleBuildCase}
              disabled={!caseName || selectedFiles.length === 0}
            >
              Build Case
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
} 