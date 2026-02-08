export type MockRole = "guest" | "peserta" | "admin" | "instruktur" | "asesor" | "direktur";

const useMockSession = () => {
//   const role: MockRole = "peserta"; 
  const role: MockRole = "guest";

  const isLoggedIn = (role as MockRole) !== "guest";

  return {
    user: isLoggedIn
      ? {
          name: "Azi Peserta",
          role,
        }
      : null,
    role,
    isLoggedIn,
  };
}

export { useMockSession };
