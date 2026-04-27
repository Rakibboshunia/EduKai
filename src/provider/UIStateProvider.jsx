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
  const [cvQueue, setCvQueue] = useState(() => {
    const saved = localStorage.getItem("ui_cvQueue");
    return saved ? JSON.parse(saved) : { searchTerm: "", activeTab: "all", page: 1 };
  });

  const [mailSubmission, setMailSubmission] = useState(() => {
    const saved = localStorage.getItem("ui_mailSubmission");
    return saved ? JSON.parse(saved) : { selectedIds: [], filters: {}, orgSearch: "", page: 1 };
  });

  const [orgs, setOrgs] = useState(() => {
    const saved = localStorage.getItem("ui_orgs");
    return saved ? JSON.parse(saved) : { searchQuery: "", phaseFilter: "", townFilter: "", genderFilter: "", laFilter: "", page: 1 };
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("ui_contacts");
    return saved ? JSON.parse(saved) : { searchQuery: "", jobFilter: "", orgFilter: "", laFilter: "", page: 1 };
  });

  const [tracking, setTracking] = useState(() => {
    const saved = localStorage.getItem("ui_tracking");
    return saved ? JSON.parse(saved) : { searchQuery: "", activeTab: "all", page: 1 };
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("ui_cvQueue", JSON.stringify(cvQueue));
  }, [cvQueue]);

  useEffect(() => {
    localStorage.setItem("ui_mailSubmission", JSON.stringify(mailSubmission));
  }, [mailSubmission]);

  useEffect(() => {
    localStorage.setItem("ui_orgs", JSON.stringify(orgs));
  }, [orgs]);

  useEffect(() => {
    localStorage.setItem("ui_contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("ui_tracking", JSON.stringify(tracking));
  }, [tracking]);

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
