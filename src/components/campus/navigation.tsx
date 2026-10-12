import { useState } from 'react';
import { ArrowRight, GraduationCap, Menu, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const navigation = [
  ['Features', 'features'],
  ['How It Works', 'how-it-works'],
  ['Architecture', 'architecture'],
  ['Resources', 'resources'],
  ['FAQ', 'faq'],
];

export function Brand() {
  return (
    <a href="#top" className="brand" aria-label="CampusAI home">
      <div className="brand-mark">
        <GraduationCap size={20} className="brand-cap" />
        <Sparkles size={11} className="brand-spark" />
      </div>
      <span className="brand-text">
        Campus<span className="gradient-brand-text">AI</span>
      </span>
      <span className="nav-version-badge">Preview</span>
    </a>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="nav-inner">
          <Brand />

          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="nav-link">
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <Button
              variant="ghost"
              size="sm"
              className="login-nav-btn"
              onClick={() => setLogin(true)}
            >
              Sign In
            </Button>
            <Button size="sm" className="cta-nav-btn" asChild>
              <a href="#demo">
                Explore Demo <ArrowRight size={14} className="ml-1" />
              </a>
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="mobile-menu"
                aria-label="Open navigation menu"
              >
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="mobile-sheet-content">
              <div className="mobile-sheet-header">
                <Brand />
                <SheetTitle className="sr-only">CampusAI Navigation Menu</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-1">
                  Institutional knowledge at your fingertips.
                </SheetDescription>
              </div>
              <nav className="mobile-links">
                {navigation.map(([label, id]) => (
                  <Button
                    variant="ghost"
                    asChild
                    key={id}
                    className="justify-start text-sm"
                  >
                    <a href={`#${id}`} onClick={() => setOpen(false)}>
                      {label}
                    </a>
                  </Button>
                ))}
                <div className="mobile-cta-group pt-4 border-t border-border mt-2">
                  <Button
                    className="w-full justify-center"
                    asChild
                  >
                    <a href="#demo" onClick={() => setOpen(false)}>
                      Explore Campus Demo <ArrowRight size={14} className="ml-1" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center mt-2"
                    onClick={() => {
                      setOpen(false);
                      setLogin(true);
                    }}
                  >
                    Sign In (Student Portal)
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Login Preview Dialog */}
      <Dialog open={login} onOpenChange={setLogin}>
        <DialogContent className="login-dialog-content">
          <div className="login-modal-icon">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <DialogTitle className="text-lg font-bold">Campus Student Access</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
            CampusAI is currently running in public interactive preview mode. Live university single sign-on (SSO) and student account integration will roll out with partner campus deployments.
          </DialogDescription>
          <div className="login-modal-box">
            <ShieldCheck size={16} className="text-success shrink-0" />
            <span className="text-xs text-muted-foreground">
              You can test all RAG search capabilities, notes retrieval, and study planner features immediately with our sample documents.
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="w-full"
              asChild
            >
              <a href="#demo" onClick={() => setLogin(false)}>
                Launch Interactive Playground <ArrowRight size={15} className="ml-1" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLogin(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
