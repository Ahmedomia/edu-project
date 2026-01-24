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
          set({ user: foundUser, username: foundUser.name || null });
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
            city: profileData.city,
            photo: profileData.photo || currentUser.photo,
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

      addExperience: (experience) => {
        const currentExperiences = get().experiences;
        set({
          experiences: [
            ...currentExperiences,
            { id: Date.now(), ...experience },
          ],
        });
      },

      deleteExperience: (id) => {
        const currentExperiences = get().experiences;
        set({ experiences: currentExperiences.filter((exp) => exp.id !== id) });
      },

      setCompanyProfile: (companyData) => {
        set({ companyProfile: companyData });
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, name: companyData.name };
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
        set({
          teacherStats: {
            ...stats,
            interviewInvitations: stats.interviewInvitations + 1,
          },
        });
      },

      addJobApplication: (jobId) => {
        const applications = get().jobApplications;
        const user = get().user;
        const jobs = get().companyJobs;

        const alreadyApplied = applications.some(
          (app) => app.jobId === jobId && app.teacherId === user?.email,
        );
        if (alreadyApplied) return;

        const job = jobs.find((j) => j.id === jobId);

        const newApplication = {
          id: Date.now(),
          jobId,
          teacherId: user?.email,
          teacherName: user?.name,
          company: job?.company,
          appliedAt: new Date().toISOString(),
        };

        set({
          jobApplications: [...applications, newApplication],

          companyJobs: jobs.map((j) =>
            j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j,
          ),

          teacherStats: {
            ...get().teacherStats,
            jobApplications: get().teacherStats.jobApplications + 1,
          },
        });
      },

      incrementJobView: () => {
        const stats = get().companyStats;
        set({ companyStats: { ...stats, jobViews: stats.jobViews + 1 } });
      },

      logout: () => {
        set({
          user: null,
          username: null,
        });
      },
    }),
    {
      name: "job-platform-storage",
    },
  ),
);

export default useStore;
