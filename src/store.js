import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      username: null,
      registeredUsers: [],
      profile: null,
      experiences: [],
      companyProfile: null,
      companyJobs: [],
      teacherStats: {
        profileViews: 0,
        interviewInvitations: 0,
        jobApplications: 0,
      },
      companyStats: {
        jobViews: 0,
        totalApplicants: 0,
      },
      jobApplications: [],
      setUser: (userData) => {
        const registeredUsers = get().registeredUsers;
        const existingUserIndex = registeredUsers.findIndex(
          (u) => u.email === userData.email,
        );

        if (existingUserIndex === -1) {
          set({
            registeredUsers: [...registeredUsers, userData],
            user: userData,
            username: userData?.name || null,
          });
        } else {
          const updatedUsers = [...registeredUsers];
          updatedUsers[existingUserIndex] = userData;
          set({
            registeredUsers: updatedUsers,
            user: userData,
            username: userData?.name || null,
          });
        }
      },

      loginUser: (email) => {
        const registeredUsers = get().registeredUsers;
        const foundUser = registeredUsers.find((u) => u.email === email);
        if (foundUser) {
          const experiences = foundUser.experiences || [];
          const totalExperienceYears = get().calculateTotalExperience(experiences);
          
          // Hydrate stats or use defaults
          const teacherStats = foundUser.teacherStats || {
            profileViews: 0,
            interviewInvitations: 0,
            jobApplications: 0,
          };

          const companyStats = foundUser.companyStats || {
             jobViews: 0,
             totalApplicants: 0,
          };
          
          let userToSet = { ...foundUser, experiences, totalExperienceYears, teacherStats, companyStats };
          
          set({ 
            user: userToSet, 
            username: foundUser.name || null,
            experiences: experiences,
            teacherStats: teacherStats,
            companyStats: companyStats,
            companyProfile: null, // Clear potential previous session draft
            profile: null, // Clear potential previous session draft
          });
          return true;
        }
        return false;
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...updates };
        const registeredUsers = get().registeredUsers;
        const userIndex = registeredUsers.findIndex(
          (u) => u.email === currentUser?.email,
        );

        if (userIndex !== -1) {
          const updatedRegisteredUsers = [...registeredUsers];
          updatedRegisteredUsers[userIndex] = updatedUser;
          set({
            registeredUsers: updatedRegisteredUsers,
            user: updatedUser,
            username: updatedUser?.name || null,
          });
        } else {
          set({ user: updatedUser, username: updatedUser?.name || null });
        }
      },

      setProfile: (profileData) => {
        set({ profile: profileData });
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: profileData.name,
            jobTitle: profileData.jobTitle || currentUser.jobTitle,
            bio: profileData.bio,
            email: profileData.email,
            phone: profileData.phone,
            landline: profileData.landline || currentUser.landline || "",
            country: profileData.country,
            city: profileData.city,
            neighborhood: profileData.neighborhood,
            gender: profileData.gender || currentUser.gender,
            photo: profileData.photo || currentUser.photo,
            cv: profileData.cv || currentUser.cv,
            languageSkills: profileData.languageSkills || currentUser.languageSkills || [],
            education: profileData.education || currentUser.education || "",
            educationField: profileData.educationField || currentUser.educationField || "",
          };
          const registeredUsers = get().registeredUsers;
          const userIndex = registeredUsers.findIndex(
            (u) => u.email === currentUser.email,
          );

          if (userIndex !== -1) {
            const updatedRegisteredUsers = [...registeredUsers];
            updatedRegisteredUsers[userIndex] = updatedUser;
            set({
              registeredUsers: updatedRegisteredUsers,
              user: updatedUser,
              username: updatedUser.name,
            });
          } else {
            set({ user: updatedUser, username: updatedUser.name });
          }
        }
      },

      setExperiences: (experiences) => {
        set({ experiences });
      },

      calculateTotalExperience: (experiences) => {
        if (!experiences || experiences.length === 0) return 0;
        
        const parseYear = (str) => {
          if (!str) return NaN;
          const englishDigits = str.toString().replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
          return parseInt(englishDigits);
        };

        let total = 0;
        experiences.forEach(exp => {
          const fromYear = parseYear(exp.from);
          let toYear = parseYear(exp.to);
          
          if (!fromYear) return;
          
          // If 'to' is not a number, use current year
          if (!toYear) {
             toYear = new Date().getFullYear();
          }
          
          if (toYear >= fromYear) {
            const diff = toYear - fromYear;
            total += (diff === 0 ? 1 : diff);
          }
        });
        return total;
      },

      addExperience: (experience) => {
        const currentExperiences = get().experiences;
        const newExperiences = [
          ...currentExperiences,
          { id: Date.now(), ...experience },
        ];
        
        const totalExperienceYears = get().calculateTotalExperience(newExperiences);
        
        set({ experiences: newExperiences });

        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { 
            ...currentUser, 
            experiences: newExperiences,
            totalExperienceYears: totalExperienceYears 
          };
          
          const registeredUsers = get().registeredUsers;
          const userIndex = registeredUsers.findIndex(
            (u) => u.email === currentUser.email
          );

          if (userIndex !== -1) {
            const updatedRegisteredUsers = [...registeredUsers];
            updatedRegisteredUsers[userIndex] = updatedUser;
            set({
              registeredUsers: updatedRegisteredUsers,
              user: updatedUser,
            });
          }
        }
      },

      deleteExperience: (id) => {
        const currentExperiences = get().experiences;
        const newExperiences = currentExperiences.filter((exp) => exp.id !== id);
        
        const totalExperienceYears = get().calculateTotalExperience(newExperiences);
        
        set({ experiences: newExperiences });
        
        const currentUser = get().user;
        if (currentUser) {
           const updatedUser = { 
             ...currentUser, 
             experiences: newExperiences,
             totalExperienceYears: totalExperienceYears
           };
           const registeredUsers = get().registeredUsers;
           const userIndex = registeredUsers.findIndex(
             (u) => u.email === currentUser.email
           );
 
           if (userIndex !== -1) {
             const updatedRegisteredUsers = [...registeredUsers];
             updatedRegisteredUsers[userIndex] = updatedUser;
             set({
               registeredUsers: updatedRegisteredUsers,
               user: updatedUser,
             });
           }
        }
      },

      setCompanyProfile: (companyData) => {
        set({ companyProfile: companyData });
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { 
            ...currentUser, 
            name: companyData.name,
            country: companyData.country,
            city: companyData.city,
            neighborhood: companyData.neighborhood,
            phone: companyData.phone,
            landline: companyData.landline || currentUser.landline || "",
            mapUrl: companyData.mapUrl,
            educationType: companyData.educationType || "",
            educationCategory: companyData.educationCategory || "",
            stages: companyData.stages || [],
            bio: companyData.bio || "",
            photo: companyData.logo || companyData.photo || currentUser.photo || ""
          };
          const registeredUsers = get().registeredUsers;
          const userIndex = registeredUsers.findIndex(
            (u) => u.email === currentUser.email,
          );

          if (userIndex !== -1) {
            const updatedRegisteredUsers = [...registeredUsers];
            updatedRegisteredUsers[userIndex] = updatedUser;
            set({
              registeredUsers: updatedRegisteredUsers,
              user: updatedUser,
              username: updatedUser.name,
            });
          } else {
            set({ user: updatedUser, username: updatedUser.name });
          }
        }
      },

      addJob: (job) => {
        const currentJobs = get().companyJobs;
        const currentUser = get().user;
        const newJob = {
          id: Date.now(),
          ...job,
          company: currentUser?.name || "منشأة",
          companyEmail: currentUser?.email, // Link job to specific user email
          status: "active",
          createdAt: new Date().toISOString(),
          applicants: 0,
        };
        set({ companyJobs: [...currentJobs, newJob] });
      },

      updateJob: (id, updates) => {
        const currentJobs = get().companyJobs;
        set({
          companyJobs: currentJobs.map((job) =>
            job.id === id ? { ...job, ...updates } : job,
          ),
        });
      },

      deleteJob: (id) => {
        const currentJobs = get().companyJobs;
        set({ companyJobs: currentJobs.filter((job) => job.id !== id) });
      },

      incrementInterviewInvitation: () => {
        const stats = get().teacherStats;
        const newStats = {
            ...stats,
            interviewInvitations: stats.interviewInvitations + 1,
        };
        set({ teacherStats: newStats });

        // Persist to user
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, teacherStats: newStats };
            const registeredUsers = get().registeredUsers;
            const idx = registeredUsers.findIndex(u => u.email === currentUser.email);
            if (idx !== -1) {
                const updatedRegisteredUsers = [...registeredUsers];
                updatedRegisteredUsers[idx] = updatedUser;
                set({ registeredUsers: updatedRegisteredUsers, user: updatedUser });
            }
        }
      },

      applyForJob: (application) => {
        const currentApplications = get().jobApplications;
        
        const alreadyApplied = currentApplications.some(
          (app) => app.jobId === application.jobId && app.teacherId === application.teacherId
        );
        if (alreadyApplied) return;

        const newApplication = {
          id: Date.now(),
          ...application,
          appliedAt: new Date(),
          status: "pending",
        };

        const newTeacherStats = {
            ...get().teacherStats,
            jobApplications: get().teacherStats.jobApplications + 1,
        };

        set({
          jobApplications: [...currentApplications, newApplication],
          teacherStats: newTeacherStats,
        });

        // Persist Stats to User
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, teacherStats: newTeacherStats };
            const registeredUsers = get().registeredUsers;
            const idx = registeredUsers.findIndex(u => u.email === currentUser.email);
            if (idx !== -1) {
                const updatedRegisteredUsers = [...registeredUsers];
                updatedRegisteredUsers[idx] = updatedUser;
                set({ registeredUsers: updatedRegisteredUsers, user: updatedUser });
            }
        }

        const jobs = get().companyJobs;
        const jobIndex = jobs.findIndex((j) => j.id === application.jobId);
        if (jobIndex !== -1) {
          const updatedJobs = [...jobs];
          updatedJobs[jobIndex] = {
            ...updatedJobs[jobIndex],
            applicants: (updatedJobs[jobIndex].applicants || 0) + 1,
          };
          set({ companyJobs: updatedJobs });
        }
      },

      updateApplicationStatus: (applicationId, status) => {
        const currentApplications = get().jobApplications;
        const appIndex = currentApplications.findIndex(
          (app) => app.id === applicationId
        );
        if (appIndex !== -1) {
          const updatedApplications = [...currentApplications];
          updatedApplications[appIndex] = {
            ...updatedApplications[appIndex],
            status: status,
          };
          set({ jobApplications: updatedApplications });
        }
      },

      incrementJobView: () => {
        const stats = get().companyStats;
        const newStats = { ...stats, jobViews: stats.jobViews + 1 };
        set({ companyStats: newStats });
        
         // Persist to user (Company)
         const currentUser = get().user;
         if (currentUser) {
             const updatedUser = { ...currentUser, companyStats: newStats };
             const registeredUsers = get().registeredUsers;
             const idx = registeredUsers.findIndex(u => u.email === currentUser.email);
             if (idx !== -1) {
                 const updatedRegisteredUsers = [...registeredUsers];
                 updatedRegisteredUsers[idx] = updatedUser;
                 set({ registeredUsers: updatedRegisteredUsers, user: updatedUser });
             }
         }
      },

      logout: () => {
        set({
          user: null,
          username: null,
          profile: null,
          experiences: [],
          companyProfile: null,
          teacherStats: {
            profileViews: 0,
            interviewInvitations: 0,
            jobApplications: 0,
          },
          companyStats: {
            jobViews: 0,
            totalApplicants: 0,
          },
        });
      },
    }),
    {
      name: "job-platform-storage",
    },
  ),
);

export default useStore;
