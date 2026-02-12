"use client";

import { useEffect, useState } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function QuickExit() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleQuickExit = () => {
    // Clear local storage (removes age verification and any session data)
    localStorage.clear();
    
    // Navigate to a neutral site (Google)
    window.location.href = 'https://www.google.com';
  };

  // Keyboard shortcut: Press Escape 3 times quickly to trigger
  useEffect(() => {
    let escapeCount = 0;
    let lastEscapeTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscapeTime < 1000) {
          escapeCount++;
          if (escapeCount >= 3) {
            setShowConfirm(true);
            escapeCount = 0;
          }
        } else {
          escapeCount = 1;
        }
        lastEscapeTime = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Quick Exit Button */}
      <Button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-40 bg-coral hover:bg-coral-light text-white shadow-lg hover:shadow-xl transition-all"
        size="sm"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Quick Exit
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-coral-subtle rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-coral" />
              </div>
              <DialogTitle>Quick Exit</DialogTitle>
            </div>
            <DialogDescription>
              This will immediately navigate to Google and clear your local data. 
              Use this if you need to quickly leave this site.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickExit}
              className="bg-coral hover:bg-coral-light text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
