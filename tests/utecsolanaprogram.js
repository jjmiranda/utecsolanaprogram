const anchor = require('@project-serum/anchor');

// Need the system program, will talk about this soon.
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Utecsolanaprogram;

  // Create an account keypair for our program to use.
  //const baseAccount = anchor.web3.Keypair.generate();
  const baseAccount = "7jATNo4vCEHJRMCb88ms1J43Vfq6sVVVE21Sf17zrwNg";

  // Call initilize, pass it the params it needs!
  let tx = await program.rpc.initialize({
    accounts: {
      baseAccount: baseAccount,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("Este es el URL del GIF 2, Clases UTEC", {
    accounts: {
      baseAccount: baseAccount,
      user: provider.wallet.publicKey,
    },
  });

  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount);
  console.log('👀 GIF Count', account.totalGifs.toString());

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList);

}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();