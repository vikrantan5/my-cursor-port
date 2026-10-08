export function modifierLabel(): "⌘" {
  return "⌘";
}

export function isModKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey;
}
