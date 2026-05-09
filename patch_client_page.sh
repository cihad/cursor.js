#!/bin/bash
cat << 'INNER_EOF' > tmp.tsx
                      {/* Prompt Plugin */}
                      <AccordionItem value="prompt" className="relative">
                        <SettingsAccordionTrigger hideIcon className="hover:no-underline">
                          <div className="flex items-center gap-1.5">Prompt UI (Interactivity)</div>
                        </SettingsAccordionTrigger>
                        <div className="absolute right-0 top-4">
                          <Switch
                            id="enable-prompt"
                            checked={settings.plugins.prompt}
                            onCheckedChange={(checked) =>
                              dispatch({
                                type: 'TOGGLE_PLUGIN',
                                plugin: 'prompt',
                                enabled: checked,
                              })
                            }
                          />
                        </div>
                      </AccordionItem>

                      {/* Say Plugin */}
INNER_EOF

sed -i -e '/<AccordionItem value="say" className="relative">/r tmp.tsx' -e '//N' apps/docs/src/app/\(home\)/ClientPage.tsx
sed -i 's/{.*Prompt Plugin.*}/{/* Prompt Plugin */}/g' apps/docs/src/app/\(home\)/ClientPage.tsx
rm tmp.tsx
