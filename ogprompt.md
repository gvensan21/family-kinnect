# GotraBandhus: Master Plan

## 1. App Overview and Objectives
**GotraBandhus** is a web-based application designed to help individuals build and visualize their family tree, fostering connections across generations. Users can manually create their lineage, link with existing family trees, and explore relationships in an interactive and graphical format.

## 2. Target Audience
- Individuals interested in genealogy and ancestry tracking
- Families wanting to document and maintain their lineage
- Communities preserving cultural and familial histories

## 3. Core Features and Functionality
### a) User Management
- Local authentication + Google & Facebook authentication
- Role-based permissions (owner, contributor, viewer)

### b) Family Tree Building
- Users manually add relationships: **Father, Mother, Wife, Husband, Son, Daughter**
- Ability to **link/merge** with existing trees (requires approval from the tree owner)
- UI-driven experience for building the tree **modeled exactly after** [Family Chart](https://donatso.github.io/family-chart-doc/create-tree/)

### c) Privacy & Security
- Users can **hide personal details** (email, phone, date of birth)
- Family trees can be **public or private**
- Deleted data retained for **30 days** before permanent deletion

### d) Visualization & Navigation
- **Tree view** as the primary visualization, modeled exactly after [Family Chart](https://donatso.github.io/family-chart-doc/create-tree/)
- **Timeline view** for historical perspective
- Users can **zoom, drag, search, expand nodes**
- Export and print functionality

### e) Data Management
- Admins can **import bulk data**
- Users can **download backups** in JSON, CSV, or GEDCOM formats
- **Manual save** option (no auto-save)

### f) Collaboration & Communication
- Users can **invite family members** to contribute
- **Real-time collaboration** (different parts of the tree can be edited simultaneously)
- **Messaging system** for in-app communication

### g) Notifications & Reminders
- Email notifications for updates, invitations, and approvals
- Birthday/anniversary reminders
- Fully customizable notification settings

## 4. High-Level Technical Stack Recommendations
- **Frontend:** React (for dynamic UI and smooth interactions)
- **Backend:** Node.js with Express (scalable API handling)
- **Database:** 
  - **MongoDB** for user profiles and metadata
  - **Neo4j** for relationship and ancestry tracking
- **Authentication:** OAuth (Google, Facebook) + Local authentication
- **Hosting:** AWS/GCP/Azure for scalability
- **Messaging & Notifications:** Firebase or AWS SNS

## 5. Conceptual Data Model
### a) User Profile Schema
- ID, username, password, name, nickname, gotra, pravara, birth details (city, state, country)
- Primary & secondary languages, community identity
- DOB, gender, profile picture, occupation, company, industry
- Contact info (email, phone, privacy settings)
- Metadata (createdAt, updatedAt)

### b) Relationship Model
- Each user node links to **Father, Mother, Wife, Husband, Son, Daughter**
- Non-biological relationships (e.g., adoption) supported
- Relationship validation required when merging trees

## 6. Security Considerations
- Encrypted storage for sensitive data (emails, passwords, phone numbers)
- Access control for private trees
- Admin moderation for bulk data imports

## 7. Development Phases & Milestones
### Phase 1: Frontend & Tree Visualization
- Develop UI components for user registration & login
- Implement family tree visualization (modeled after Family Chart)
- Add user profile management & privacy settings

### Phase 2: Backend & Core Functionality
- Set up database (MongoDB + Neo4j)
- Develop API for user management & authentication
- Implement relationship modeling & linking logic

### Phase 3: Collaboration & Communication
- Enable user invitations & approval-based linking
- Implement messaging system
- Add notifications & reminders

### Phase 4: Optimization & Scalability
- Optimize tree rendering for large families
- Implement lazy loading & caching mechanisms
- Improve data retrieval performance

### Phase 5: Future Enhancements
- AI-based relationship suggestions
- Mobile app version

## 8. Potential Challenges & Solutions
| Challenge | Solution |
|-----------|----------|
| Large trees causing performance issues | Implement lazy loading and caching |
| Ensuring relationship accuracy | Approval-based linking and moderation |
| Handling user privacy concerns | Granular privacy controls for personal data |
| Data storage scalability | Hybrid database approach (MongoDB + Neo4j) |

## 9. Future Expansion Possibilities
- AI-powered suggestions for missing links
- Interactive timeline with historical data
- Integration with DNA ancestry services (if needed in the future)


--- 
Phase 2 Build Prompt

Phase 2: Backend & Core Functionality
Set up database (MongoDB + Neo4j)
Develop API for user management & basic (email/password) authentication
create tables for storing nodes

a) User Profile Schema
- ID, username, password, name, nickname, gotra, pravara, birth details (city, state, country), current location details (city, state, country)
- Primary & secondary languages, community identity
- DOB, gender, profile picture, occupation, company, industry
- Contact info (email, phone, privacy settings)
- Metadata (createdAt, updatedAt)
b) Support for adding relationship