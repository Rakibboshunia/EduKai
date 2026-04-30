import { createContext, useState, useEffect, useCallback, useContext } from "react";

const UIStateContext = createContext(null);

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error("useUIState must be used within a UIStateProvider");
  }
  return context;
};

const UIStateProvider = ({ children }) => {
  const [cvQueue, setCvQueue] = useState({ searchTerm: "", activeTab: "all", page: 1 });

  const [mailSubmission, setMailSubmission] = useState({ selectedIds: [], filters: {}, orgSearch: "", page: 1 });

  const [orgs, setOrgs] = useState({ searchQuery: "", phaseFilter: "", townFilter: "", genderFilter: "", laFilter: "", page: 1 });

  const [contacts, setContacts] = useState({ searchQuery: "", jobFilter: "", orgFilter: "", laFilter: "", page: 1 });

  const [tracking, setTracking] = useState({ searchQuery: "", activeTab: "all", page: 1 });

  const updateCvQueue = useCallback((updates) => {
    setCvQueue((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateMailSubmission = useCallback((updates) => {
    setMailSubmission((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateOrgs = useCallback((updates) => {
    setOrgs((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateContacts = useCallback((updates) => {
    setContacts((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateTracking = useCallback((updates) => {
    setTracking((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetMailSubmission = useCallback(() => {
    setMailSubmission({ selectedIds: [], filters: {}, orgSearch: "", page: 1 });
  }, []);

  return (
    <UIStateContext.Provider
      value={{
        cvQueue,
        updateCvQueue,
        mailSubmission,
        updateMailSubmission,
        orgs,
        updateOrgs,
        contacts,
        updateContacts,
        tracking,
        updateTracking,
        resetMailSubmission,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

export default UIStateProvider;
