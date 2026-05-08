import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cursor.js Pro',
  description: 'Advanced features for Cursor.js',
};

export default function ProLandingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Cursor.js Pro</h1>
        <p className="text-lg leading-8 text-muted-foreground mb-8">
          Take your cursor interactions to the next level with advanced plugins, premium effects,
          and priority support.
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <a
            href="#pricing"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Get Started
          </a>
          <Link href="/docs" className="text-sm font-semibold leading-6">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Feature 1 */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Advanced Trails</h3>
          <p className="text-muted-foreground">
            Create complex, multi-layered cursor trails with custom physics and particle systems.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Magnetic Elements</h3>
          <p className="text-muted-foreground">
            Easily create magnetic buttons and elements that attract the cursor with realistic
            physics.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Priority Support</h3>
          <p className="text-muted-foreground">
            Get direct access to the core team for help with implementation and custom effects.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the right plan for your team.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm mx-auto max-w-6xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 font-medium min-w-[200px] border-b align-top pt-10"></th>
                <th className="p-4 font-medium border-b min-w-[250px] align-top pt-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lg">
                      <span className="h-3 w-3 rounded-full bg-slate-300 border border-slate-400"></span>
                      Community
                    </div>
                    <div className="text-3xl font-bold">Free</div>
                    <div className="text-sm text-muted-foreground font-normal mt-2 mb-4 leading-tight">
                      For hobbyists, students, and open source projects.
                    </div>
                    <Link
                      href="/docs"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
                    >
                      Read Docs
                    </Link>
                  </div>
                </th>
                <th className="p-4 font-medium border-b min-w-[250px] align-top bg-indigo-50/50 dark:bg-indigo-950/20 relative pt-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lg">
                      <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                      <span className="text-indigo-900 dark:text-indigo-100">Pro Solo</span>
                      <span className="text-lg" title="Popular">
                        🔥
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                      $49 <span className="text-sm font-normal opacity-70">/ lifetime</span>
                    </div>
                    <div className="text-sm text-indigo-700/80 dark:text-indigo-300/80 font-normal mt-2 mb-4 leading-tight">
                      Perfect for indie hackers, freelancers, and solo devs.
                    </div>
                    <a
                      href="#"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
                    >
                      Get Pro Solo
                    </a>
                  </div>
                </th>
                <th className="p-4 font-medium border-b min-w-[250px] align-top pt-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lg">
                      <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                      Pro Team
                    </div>
                    <div className="text-3xl font-bold">
                      $149{' '}
                      <span className="text-sm font-normal text-muted-foreground">/ lifetime</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-normal mt-2 mb-4 leading-tight">
                      For agencies, startups, and companies.
                    </div>
                    <a
                      href="#"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
                    >
                      Get Pro Team
                    </a>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-muted-foreground">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Usage</td>
                <td className="p-4">Unlimited</td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <strong className="text-foreground font-semibold">1 Developer</strong>, Unlimited
                  Projects
                </td>
                <td className="p-4">
                  <strong className="text-foreground font-semibold">5 Developers</strong>, Unlimited
                  Projects
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">License Duration</td>
                <td className="p-4">MIT (Open Source)</td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  Lifetime (1 Year Updates)
                </td>
                <td className="p-4">Lifetime (1 Year Updates)</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Cursor.js Core Engine</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Move, Click, Type, Wait)</span>
                  </div>
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Standard Visuals & Sounds</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Ripple, Indicator, ClickSound)</span>
                  </div>
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Speech Bubble & Voice</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Speech Bubble, Web Speech API)</span>
                  </div>
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Spotlight (Target Dimming)</td>
                <td className="p-4">
                  <X className="h-4 w-4 text-muted-foreground/50" />
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Interactive Checkpoints</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground/50" />{' '}
                    <span className="text-xs">(Cannot wait for user)</span>
                  </div>
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Waits for user action)</span>
                  </div>
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Cross-Page Session Sync</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground/50" />{' '}
                    <span className="text-xs">(Resets on page load)</span>
                  </div>
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Scenario continues on next page)</span>
                  </div>
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">AI Voiceover (TTS)</td>
                <td className="p-4">
                  <X className="h-4 w-4 text-muted-foreground/50" />
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Google TTS & Premium Voices)</span>
                  </div>
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Premium Themes</td>
                <td className="p-4">
                  <X className="h-4 w-4 text-muted-foreground/50" />
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Nostalgic 90s, Pencil Sketch etc.)</span>
                  </div>
                </td>
                <td className="p-4">
                  <Check className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Future Plugins (e.g., Recorder)</td>
                <td className="p-4">
                  <X className="h-4 w-4 text-muted-foreground/50" />
                </td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <span className="text-xs font-medium">Discounted Access Only</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />{' '}
                    <span className="text-xs">(Beta & Early Access)</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">Support</td>
                <td className="p-4">Community (GitHub Issues)</td>
                <td className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                  Private Discord Channel
                </td>
                <td className="p-4">Priority Email Support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
