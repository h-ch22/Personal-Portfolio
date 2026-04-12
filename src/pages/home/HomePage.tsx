import { ScrollArea } from '#/components/ui/scroll-area'
import { useHomeViewController } from './HomePage.lib'
import {
  BookOpenIcon,
  GalleryHorizontalEndIcon,
  NewspaperIcon,
} from 'lucide-react'
import { type TechStack, type TechStackCategory } from '#/types/techstack'
import { BannerSection } from './components/BannerSection'
import { ProfileSection } from './components/ProfileSection'
import { TechStackSection } from './components/TechStackSection'
import { SocialLinksSection } from './components/SocialLinksSection'
import { LatestSection } from './components/LatestSection'
import { PublicationPreviewCard } from './components/PublicationPreviewCard'
import { NewsPreviewCard } from './components/NewsPreviewCard'
import { GalleryPreviewCard } from './components/GalleryPreviewCrad'
import { FeaturedProjectsSection } from './components/FeaturedProjectsSection'
import { EducationExperienceSection } from './components/EducationExperienceSection'

export default function HomePage() {
  const {
    isLoaded,
    bannerImage,
    showContent,
    bannerText,
    isEditingBanner,
    bannerTextInput,
    setBannerTextInput,
    isSavingBanner,
    handleBannerEditStart,
    handleBannerSave,
    handleBannerCancel,
    bannerImageInputRef,
    isUploadingBannerImage,
    handleBannerImageChange,
    homeDescription,
    isEditingDescription,
    descriptionInput,
    setDescriptionInput,
    isSavingDescription,
    handleDescriptionEditStart,
    handleDescriptionSave,
    handleDescriptionCancel,
    publications,
    news,
    galleries,
    techStacks,
    isAdmin,
    user,
    showAddTechStack,
    setShowAddTechStack,
    techStackForm,
    setTechStackForm,
    isAddingTechStack,
    addTechStack,
    removeTechStack,
    profileImage,
    profileImageInputRef,
    isUploadingProfileImage,
    handleProfileImageChange,
    socialLinks,
    showAddSocialLink,
    setShowAddSocialLink,
    socialLinkForm,
    setSocialLinkForm,
    isAddingSocialLink,
    addSocialLink,
    removeSocialLink,
    allProjects,
    featuredProjects,
    featuredProjectIds,
    isSavingFeatured,
    saveFeaturedProjectIds,
    recentEducation,
    recentExperience,
  } = useHomeViewController()

  const groupedTechStacks = techStacks.reduce<
    Record<TechStackCategory, TechStack[]>
  >(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<TechStackCategory, TechStack[]>,
  )

  return (
    <ScrollArea className="w-full min-h-screen">
      <div className="flex flex-col gap-4 overflow-hidden">
        <BannerSection
          isLoaded={isLoaded}
          showContent={showContent}
          bannerImage={bannerImage}
          bannerText={bannerText}
          isEditingBanner={isEditingBanner}
          bannerTextInput={bannerTextInput}
          setBannerTextInput={setBannerTextInput}
          isSavingBanner={isSavingBanner}
          handleBannerEditStart={handleBannerEditStart}
          handleBannerSave={handleBannerSave}
          handleBannerCancel={handleBannerCancel}
          bannerImageInputRef={bannerImageInputRef}
          isUploadingBannerImage={isUploadingBannerImage}
          handleBannerImageChange={handleBannerImageChange}
          user={user}
          isAdmin={isAdmin}
        />

        <ProfileSection
          profileImage={profileImage}
          profileImageInputRef={profileImageInputRef}
          isUploadingProfileImage={isUploadingProfileImage}
          handleProfileImageChange={handleProfileImageChange}
          homeDescription={homeDescription}
          isEditingDescription={isEditingDescription}
          descriptionInput={descriptionInput}
          setDescriptionInput={setDescriptionInput}
          isSavingDescription={isSavingDescription}
          handleDescriptionEditStart={handleDescriptionEditStart}
          handleDescriptionSave={handleDescriptionSave}
          handleDescriptionCancel={handleDescriptionCancel}
          user={user}
          isAdmin={isAdmin}
        />

        <TechStackSection
          techStacks={techStacks}
          groupedTechStacks={groupedTechStacks}
          user={user}
          isAdmin={isAdmin}
          showAddTechStack={showAddTechStack}
          setShowAddTechStack={setShowAddTechStack}
          techStackForm={techStackForm}
          setTechStackForm={setTechStackForm}
          isAddingTechStack={isAddingTechStack}
          addTechStack={addTechStack}
          removeTechStack={removeTechStack}
        />

        <FeaturedProjectsSection
          featuredProjects={featuredProjects}
          allProjects={allProjects}
          featuredProjectIds={featuredProjectIds}
          user={user}
          isAdmin={isAdmin}
          isSavingFeatured={isSavingFeatured}
          onSaveFeatured={saveFeaturedProjectIds}
        />

        <EducationExperienceSection
          recentEducation={recentEducation}
          recentExperience={recentExperience}
        />

        <LatestSection
          muted
          icon={BookOpenIcon}
          title="Latest Publications"
          description="Recent research papers and conference proceedings"
          viewAllTo="/publications"
          items={publications}
          renderItem={(pub) => <PublicationPreviewCard data={pub} />}
        />

        <LatestSection
          icon={NewspaperIcon}
          title="Latest News"
          description="Recent activities, awards, and updates"
          viewAllTo="/news"
          items={news}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          renderItem={(item) => <NewsPreviewCard data={item} />}
        />

        <LatestSection
          muted
          icon={GalleryHorizontalEndIcon}
          title="Latest Gallery"
          description="Photos and moments from recent events"
          viewAllTo="/gallery"
          items={galleries}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          renderItem={(item) => <GalleryPreviewCard data={item} />}
        />

        <SocialLinksSection
          socialLinks={socialLinks}
          user={user}
          isAdmin={isAdmin}
          showAddSocialLink={showAddSocialLink}
          setShowAddSocialLink={setShowAddSocialLink}
          socialLinkForm={socialLinkForm}
          setSocialLinkForm={setSocialLinkForm}
          isAddingSocialLink={isAddingSocialLink}
          addSocialLink={addSocialLink}
          removeSocialLink={removeSocialLink}
        />
      </div>
    </ScrollArea>
  )
}
