export async function submitContactForm(supabaseClient, { name, email, message }) {
  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' };
  }

  const { error } = await supabaseClient
    .from('contacts')
    .insert([{ name, email, message }]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
