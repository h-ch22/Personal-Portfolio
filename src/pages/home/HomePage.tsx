import { useHomeViewController } from './HomePage.lib'
import { GalleryHorizontalEndIcon, NewspaperIcon } from 'lucide-react'
import { BannerSection } from './components/BannerSection'
import { ProfileSection } from './components/ProfileSection'
import { TechStackSection } from './components/TechStackSection'
import { SocialLinksSection } from './components/SocialLinksSection'
import { LatestSection } from './components/LatestSection'
import { LatestPublicationsSection } from './components/LatestPublicationsSection'
import { NewsPreviewCard } from './components/NewsPreviewCard'
import { GalleryPreviewCard } from './components/GalleryPreviewCrad'
import { FeaturedProjectsSection } from './components/FeaturedProjectsSection'
import { EducationExperienceSection } from './components/EducationExperienceSection'
import { SectionSettingsDialog } from './components/SectionSettingsDialog'
import { NewsDetailDialog } from '#/pages/news/components/NewsDetailDialog'
import { GalleryDetailDialog } from '#/pages/gallery/components/GalleryDetailDialog'
import { LayoutDashboardIcon, ShieldIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'

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
    removeTechStack,
    showEditTechStack,
    setShowEditTechStack,
    editTechStackForm,
    setEditTechStackForm,
    isEditingTechStack,
    handleEditTechStackOpen,
    handleAddTechStack,
    handleEditTechStackSave,
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
    detailExperience,
    showExperienceDetail,
    setShowExperienceDetail,
    handleExperienceCardClick,
    detailNews,
    showNewsDetail,
    setShowNewsDetail,
    handleNewsCardClick,
    detailGallery,
    showGalleryDetail,
    setShowGalleryDetail,
    handleGalleryCardClick,
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
    <div className="flex flex-col gap-4 w-full">
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
          <div className="flex justify-end gap-2 px-6 -mt-2">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ShieldIcon className="w-4 h-4" />
                Admin Page
              </Button>
            </Link>
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
                    addTechStack={handleAddTechStack}
                    removeTechStack={removeTechStack}
                    showEditTechStack={showEditTechStack}
                    setShowEditTechStack={setShowEditTechStack}
                    editTechStackForm={editTechStackForm}
                    setEditTechStackForm={setEditTechStackForm}
                    isEditingTechStack={isEditingTechStack}
                    editTechStack={handleEditTechStackSave}
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
                    detailExperience={detailExperience}
                    showExperienceDetail={showExperienceDetail}
                    setShowExperienceDetail={setShowExperienceDetail}
                    onExperienceCardClick={handleExperienceCardClick}
                  />
                )
              case 'publications':
                return (
                  <LatestPublicationsSection
                    key={id}
                    muted={muted}
                    publications={publications}
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
                    gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                    renderItem={(item) => <NewsPreviewCard data={item} onClick={handleNewsCardClick} />}
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
                    gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                    renderItem={(item) => <GalleryPreviewCard data={item} onClick={handleGalleryCardClick} />}
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

        <NewsDetailDialog
          news={detailNews}
          open={showNewsDetail}
          onOpenChange={setShowNewsDetail}
        />

        <GalleryDetailDialog
          gallery={detailGallery}
          open={showGalleryDetail}
          onOpenChange={setShowGalleryDetail}
        />
    </div>
  )
}
