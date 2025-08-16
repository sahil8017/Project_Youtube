import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, Eye, ExternalLink, Bookmark, Download } from "lucide-react";

interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt: string;
  thumbnailUrl: string;
  url: string;
}

interface VideoCardProps {
  video: VideoMetadata;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 h-32 sm:h-28 bg-gray-200 flex-shrink-0">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          </div>
          
          {/* Video Info */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <span>{video.channel}</span>
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{video.publishedAt}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Watch
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Bookmark className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SummarySection {
  timestamp: string;
  title: string;
  content: string;
}

interface VideoSummaryProps {
  sections: SummarySection[];
  keyPoints: string[];
  mainTopics: string[];
}

export function VideoSummary({ sections, keyPoints, mainTopics }: VideoSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Key Points */}
      <div>
        <h4 className="font-semibold text-sm mb-2">🎯 Key Points:</h4>
        <ul className="space-y-1">
          {keyPoints.map((point, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              • {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Topics */}
      <div>
        <h4 className="font-semibold text-sm mb-2">📚 Main Topics:</h4>
        <div className="flex flex-wrap gap-2">
          {mainTopics.map((topic, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* Timestamped Sections */}
      <div>
        <h4 className="font-semibold text-sm mb-2">⏰ Timeline Summary:</h4>
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="border-l-2 border-red-200 pl-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {section.timestamp}
                </Badge>
                <span className="font-medium text-sm">{section.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
