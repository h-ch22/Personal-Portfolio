import { ScrollArea } from '#/components/ui/scroll-area'
import { useHomeViewController } from './HomePage.lib'
import {
  BookOpenIcon,
  GalleryHorizontalEndIcon,
  NewspaperIcon,
} from 'lucide-react'
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
import { SectionSettingsDialog } from './components/SectionSettingsDialog'
import { LayoutDashboardIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'

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
    profileImage,
    profileImageInputRef,
    isUploadingProfileImage,
    handleProfileImageChange,
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
    editingTechStack,
    showEditTechStack,
    setShowEditTechStack,
    editTechStackForm,
    setEditTechStackForm,
    isEditingTechStack,
    editTechStack,
    handleEditTechStackOpen,
    techStackViewMode,
    setTechStackViewMode,
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
    isSavingFeatured,
    showFeaturedSelectDialog,
    setShowFeaturedSelectDialog,
    featuredSelectedIds,
    handleOpenFeaturedSelectDialog,
    handleFeaturedToggle,
    handleFeaturedSave,
    detailProject,
    showProjectDetail,
    setShowProjectDetail,
    handleProjectCardClick,
    maxFeatured,
    recentEducation,
    recentExperience,
    sectionVisibility,
    sectionOrder,
    saveSectionOrder,
    showSectionSettings,
    setShowSectionSettings,
    handleToggleSection,
    handleResetSections,
  } = useHomeViewController()

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

        {user && isAdmin && (
          <div className="flex justify-end px-6 -mt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowSectionSettings(true)}
            >
              <LayoutDashboardIcon className="w-4 h-4" />
              Manage Sections
            </Button>
          </div>
        )}

        {(() => {
          const visibleOrder = sectionOrder.filter(
            (id) => sectionVisibility[id],
          )
          return sectionOrder.map((id) => {
            if (!sectionVisibility[id]) return null
            const muted = visibleOrder.indexOf(id) % 2 !== 0
            switch (id) {
              case 'techStack':
                return (
                  <TechStackSection
                    key={id}
                    muted={muted}
                    techStacks={techStacks}
                    user={user}
                    isAdmin={isAdmin}
                    showAddTechStack={showAddTechStack}
                    setShowAddTechStack={setShowAddTechStack}
                    techStackForm={techStackForm}
                    setTechStackForm={setTechStackForm}
                    isAddingTechStack={isAddingTechStack}
                    addTechStack={addTechStack}
                    removeTechStack={removeTechStack}
                    showEditTechStack={showEditTechStack}
                    setShowEditTechStack={setShowEditTechStack}
                    editTechStackForm={editTechStackForm}
                    setEditTechStackForm={setEditTechStackForm}
                    isEditingTechStack={isEditingTechStack}
                    editTechStack={editTechStack}
                    editingTechStack={editingTechStack}
                    handleEditTechStackOpen={handleEditTechStackOpen}
                    techStackViewMode={techStackViewMode}
                    setTechStackViewMode={setTechStackViewMode}
                  />
                )
              case 'featuredProjects':
                return (
                  <FeaturedProjectsSection
                    key={id}
                    muted={muted}
                    featuredProjects={featuredProjects}
                    allProjects={allProjects}
                    featuredSelectedIds={featuredSelectedIds}
                    user={user}
                    isAdmin={isAdmin}
                    isSavingFeatured={isSavingFeatured}
                    maxFeatured={maxFeatured}
                    showSelectDialog={showFeaturedSelectDialog}
                    setShowSelectDialog={setShowFeaturedSelectDialog}
                    onOpenSelectDialog={handleOpenFeaturedSelectDialog}
                    onToggle={handleFeaturedToggle}
                    onSave={handleFeaturedSave}
                    detailProject={detailProject}
                    showDetail={showProjectDetail}
                    setShowDetail={setShowProjectDetail}
                    onCardClick={handleProjectCardClick}
                  />
                )
              case 'educationExperience':
                return (
                  <EducationExperienceSection
                    key={id}
                    muted={muted}
                    recentEducation={recentEducation}
                    recentExperience={recentExperience}
                  />
                )
              case 'publications':
                return (
                  <LatestSection
                    key={id}
                    muted={muted}
                    icon={BookOpenIcon}
                    title="Latest Publications"
                    description="Recent research papers and conference proceedings"
                    viewAllTo="/publications"
                    items={publications}
                    renderItem={(pub) => <PublicationPreviewCard data={pub} />}
                  />
                )
              case 'news':
                return (
                  <LatestSection
                    key={id}
                    muted={muted}
                    icon={NewspaperIcon}
                    title="Latest News"
                    description="Recent activities, awards, and updates"
                    viewAllTo="/news"
                    items={news}
                    gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    renderItem={(item) => <NewsPreviewCard data={item} />}
                  />
                )
              case 'gallery':
                return (
                  <LatestSection
                    key={id}
                    muted={muted}
                    icon={GalleryHorizontalEndIcon}
                    title="Latest Gallery"
                    description="Photos and moments from recent events"
                    viewAllTo="/gallery"
                    items={galleries}
                    gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    renderItem={(item) => <GalleryPreviewCard data={item} />}
                  />
                )
              case 'socialLinks':
                return (
                  <SocialLinksSection
                    key={id}
                    muted={muted}
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
                )
              default:
                return null
            }
          })
        })()}

        <SectionSettingsDialog
          open={showSectionSettings}
          onOpenChange={setShowSectionSettings}
          order={sectionOrder}
          visibility={sectionVisibility}
          onReorder={saveSectionOrder}
          onToggle={handleToggleSection}
          onReset={handleResetSections}
        />
      </div>
    </ScrollArea>
  )
}
