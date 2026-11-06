import { toTelHref } from '../utils/format'

// Conversions entre les lignes de la base (snake_case) et les objets de l'interface.
const toImage = (url, alt) => (url ? { url, alt: alt ?? '' } : null)

export function profileFromRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    firstName: row.first_name,
    lastName: row.last_name,
    specialties: row.specialties,
    location: row.location,
    shortIntro: row.short_intro,
    biography: row.biography,
    focusAreas: row.focus_areas,
    heroImage: toImage(row.hero_image_url, row.hero_image_alt),
    profileImage: toImage(row.profile_image_url, row.profile_image_alt),
    phone: row.phone,
    phoneHref: toTelHref(row.phone),
    whatsappNumber: row.whatsapp_number,
    whatsappMessage: row.whatsapp_message,
    email: row.email,
    socialLinks: row.social_links,
    contactInvitation: row.contact_invitation,
    experiences: row.experiences,
    collaborations: row.collaborations,
    education: row.education,
    skills: row.skills,
    tools: row.tools,
    languages: row.languages,
    updatedAt: row.updated_at,
  }
}

export function profileToRow(profile) {
  return {
    full_name: `${profile.firstName} ${profile.lastName}`.trim(),
    first_name: profile.firstName,
    last_name: profile.lastName,
    specialties: profile.specialties,
    location: profile.location,
    short_intro: profile.shortIntro,
    biography: profile.biography,
    focus_areas: profile.focusAreas,
    hero_image_url: profile.heroImage?.url ?? null,
    hero_image_alt: profile.heroImage?.alt ?? null,
    profile_image_url: profile.profileImage?.url ?? null,
    profile_image_alt: profile.profileImage?.alt ?? null,
    phone: profile.phone,
    whatsapp_number: profile.whatsappNumber,
    whatsapp_message: profile.whatsappMessage,
    email: profile.email,
    social_links: profile.socialLinks,
    contact_invitation: profile.contactInvitation,
    experiences: profile.experiences,
    collaborations: profile.collaborations,
    education: profile.education,
    skills: profile.skills,
    tools: profile.tools,
    languages: profile.languages,
  }
}

export function serviceFromRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    items: row.items,
    image: toImage(row.image_url, row.image_alt),
    isPublished: row.is_published,
    displayOrder: row.display_order,
    updatedAt: row.updated_at,
  }
}

export function serviceToRow(service) {
  return {
    slug: service.slug,
    title: service.title,
    description: service.description,
    items: service.items,
    image_url: service.image?.url ?? null,
    image_alt: service.image?.alt ?? null,
    is_published: service.isPublished,
    display_order: service.displayOrder,
  }
}

function mediaFromRow(row) {
  return {
    id: row.id,
    type: row.media_type,
    url: row.media_url,
    alt: row.alt_text,
    width: row.width,
    height: row.height,
    displayOrder: row.display_order,
  }
}

export function projectFromRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    description: row.description,
    coverImage: toImage(row.cover_image_url, row.cover_image_alt),
    media: (row.project_media ?? []).map(mediaFromRow).sort((a, b) => a.displayOrder - b.displayOrder),
    videoUrl: row.video_url,
    projectDate: row.project_date,
    isFeatured: row.is_featured,
    isPublished: row.is_published,
    isArchived: row.is_archived,
    displayOrder: row.display_order,
    updatedAt: row.updated_at,
  }
}

export function projectToRow(project) {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    excerpt: project.excerpt,
    description: project.description,
    cover_image_url: project.coverImage?.url ?? null,
    cover_image_alt: project.coverImage?.alt ?? null,
    video_url: project.videoUrl || null,
    project_date: project.projectDate || null,
    is_featured: project.isFeatured,
    is_published: project.isPublished,
    display_order: project.displayOrder,
  }
}

export function audioFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    audioUrl: row.audio_url,
    durationSeconds: row.duration_seconds,
    recordedOn: row.recorded_on,
    isPublished: row.is_published,
    displayOrder: row.display_order,
    updatedAt: row.updated_at,
  }
}

export function audioToRow(track) {
  return {
    title: track.title,
    category: track.category,
    description: track.description,
    audio_url: track.audioUrl,
    duration_seconds: track.durationSeconds ?? null,
    recorded_on: track.recordedOn || null,
    is_published: track.isPublished,
    display_order: track.displayOrder,
  }
}

export function messageFromRow(row) {
  return {
    id: row.id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    subject: row.subject,
    message: row.message,
    isRead: row.is_read,
    isArchived: row.is_archived,
    createdAt: row.created_at,
  }
}
