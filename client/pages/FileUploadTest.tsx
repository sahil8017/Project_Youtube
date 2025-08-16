import React from "react";
import { FileUploadDialog } from "@/components/chat-features";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";

export default function FileUploadTest() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">File Upload Test</h1>
          <p className="text-muted-foreground">Click the button below to test file upload functionality</p>
        </div>
        
        <div className="border border-border rounded-lg p-6 text-center">
          <FileUploadDialog>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </FileUploadDialog>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-2">
          <h3 className="font-medium text-foreground">Supported File Types:</h3>
          <ul className="space-y-1 text-xs">
            <li>• Images: JPG, PNG, GIF, WebP, SVG</li>
            <li>• Videos: MP4, AVI, MOV, WebM</li>
            <li>• Audio: MP3, WAV, OGG, M4A</li>
            <li>• Documents: PDF, Word, Excel, PowerPoint</li>
            <li>• Text: TXT, CSV, Markdown</li>
            <li>• Archives: ZIP, RAR</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
