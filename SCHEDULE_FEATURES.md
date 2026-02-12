# Conference Schedule - New Features

## 📅 Schedule Grid View

The schedule page has been completely redesigned to show a **daily grid layout** with tracks and rooms.

### Key Features

### 1. **Grid Layout by Day**
- Schedule organized by time slots (rows) and tracks/rooms (columns)
- Easy visual scanning of parallel sessions
- Plenary and service sessions (coffee, lunch) shown full-width

### 2. **Clickable Sessions**
- ✅ Click any session to add it to your personal agenda
- ✅ Selected sessions are highlighted with a checkmark
- ✅ Click again to deselect

### 3. **Conflict Detection**
- 🟡 Overlapping sessions are automatically detected
- Yellow ring appears around conflicting sessions
- Conflict count shown in the header
- You can still select overlapping sessions (in case you want to decide later)

### 4. **Save Agenda**
- 💾 "Save Agenda" button in the top-right
- Saves your selections to localStorage
- Agenda persists when you return to the page
- Must be signed in to save

### 5. **My Agenda Tab**
- ⭐ Dedicated "My Agenda" tab shows only selected sessions
- Sessions grouped by day
- Conflict warnings highlighted
- Easy removal with X button
- Shows count in tab badge

### 6. **Authentication Required**
- Must sign in to select sessions and save agenda
- Auth dialog appears automatically if not signed in
- Uses Firebase Authentication (Email/Password or Google)

---

## 🎨 Visual Design

### Session Cards
- **Selected**: Blue border with checkmark badge
- **Conflict**: Yellow ring indicator
- **Service/Break**: Dashed border (not clickable)
- **Height**: Scales with session duration

### Grid Structure
- **Time column**: 120px wide, shows start times
- **Track columns**: Equal width, responsive
- **Empty slots**: Dashed placeholder boxes
- **Header**: Shows track/room names

---

## 💾 Data Persistence

### localStorage Keys
- `selectedSessions`: Array of session IDs
- Automatically loaded on page load
- Updated on "Save Agenda" button click

### Future: Firebase Sync
Ready to sync to Firestore by updating the save/load functions to use:
```typescript
// In auth context or a custom hook
const saveAgendaToFirestore = async (uid: string, sessions: string[]) => {
  await setDoc(doc(db, "users", uid), { 
    savedSessionIds: sessions 
  }, { merge: true });
}
```

---

## 🔧 Technical Implementation

### Components

#### `schedule/page.tsx`
Main schedule page with:
- Day tabs (Tue, Wed, Thu)
- My Agenda tab
- Save button with conflict detection
- Grid layout logic

#### `schedule/schedule-grid-cell.tsx`
Individual session cell component:
- Click handler for selection
- Visual states (selected, conflict)
- Service session styling
- Responsive height based on duration

#### `schedule/agenda-session-card.tsx`
Agenda view card component:
- Cleaner list view
- Remove button
- Conflict badges
- Full session details

---

## 🎯 User Flow

1. **Browse Schedule**
   - Select a day tab
   - View sessions in grid format
   - See time slots and tracks at a glance

2. **Select Sessions**
   - Click sessions to add to agenda
   - Visual feedback (blue border + checkmark)
   - Can select multiple sessions

3. **Handle Conflicts**
   - Yellow ring shows overlapping sessions
   - Conflict count in header
   - User decides which to keep

4. **Save Agenda**
   - Click "Save Agenda" button
   - Shows "Saved!" confirmation
   - Persists across sessions

5. **View My Agenda**
   - Switch to "My Agenda" tab
   - See all selected sessions organized by day
   - Remove unwanted sessions
   - View conflict warnings

---

## 🚀 Future Enhancements

### Potential Features
- [ ] Export agenda to calendar (.ics file)
- [ ] Email/print agenda
- [ ] Session reminders
- [ ] Sync across devices (Firestore)
- [ ] Share agenda with colleagues
- [ ] Session rating/feedback
- [ ] Add notes to sessions
- [ ] Filter by track on grid view
- [ ] Mobile-optimized grid view
- [ ] Drag-and-drop for time management

---

## 📱 Responsive Design

- Desktop: Full grid view with all tracks
- Tablet: Horizontal scroll if needed
- Mobile: May need optimization (consider list view toggle)

---

## 🐛 Known Considerations

1. **Mobile View**: Grid may be wide on small screens - consider adding a list view toggle
2. **Large Conferences**: Many tracks may require horizontal scrolling
3. **Session Details**: Click to expand for full description (future enhancement)
4. **Auth State**: Currently uses localStorage - will sync to Firestore for logged-in users

---

## 💡 Tips for Users

- **Sign in first** to save your agenda
- **Select liberally** - you can remove sessions later
- **Watch for conflicts** - yellow badges indicate overlaps
- **Save often** - click Save Agenda to persist changes
- **Use My Agenda tab** - cleaner view of your selections
