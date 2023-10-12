import {useState, createContext, useEffect} from 'react';
import Header from './components/Header'
import Main from './components/Main'
import Login from './components/Login'
import { ethers } from 'ethers';
import paypal from './paypal/paypal.json'

const AppState = createContext();

function App() {
  const {ethereum} = window;
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
  const [ercTokenAddress, setErcTokenAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [paypalContractAddress, setPaypalContractAddress] = useState('');
  const [explorer, setExplorer] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tokenChanged, setTokenChanged] = useState(false);
  const [showErc, setShowErc] = useState(false);
  const [ercLoading, setErcLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false)
  const [showRecentTx, setShowRecentTx] = useState(false)
  const [recentTx, setRecentTx] = useState({
    txhash: '',
    from: '',
    to: '',
    amount: '',
    symbol: ''
  })
  const [saveTxLoad, setSaveTxLoad] = useState(false);
  
async function getBal() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    setBalance(ethers.utils.formatEther(balance))
}


const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const ERCABI = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)",
  "function symbol() external view returns (string memory)",
  "function name() external view returns (string memory)"
]

// Contracts 
const ERCContract = new ethers.Contract(ercTokenAddress, ERCABI, signer);
const paypalContract = new ethers.Contract(paypalContractAddress, paypal.output.abi, signer);


const selectToken = async () => {
  try {
  setErcLoading(true);
  const name = await ERCContract.name();
  const balance = await ERCContract.balanceOf(address);
  const symbol = await ERCContract.symbol();
  setBalance(ethers.utils.formatEther(balance))
  setSymbol(symbol)
  setCurrency(name)
  setTokenChanged(true);
  setErcLoading(false);
  } catch(error) {
    setError(error.message)
    setErcLoading(false);
  }
}

const removeToken = async () => {
  try {
  if(chain == "Ropsten") {
    setCurrency("RopstenEther")
    setSymbol("rEth")
  } else if(chain == "Rinkeby") {
    setCurrency("RinkebyEther")
    setSymbol("rEth")
  } else if(chain == "polygon") {
    setCurrency("Matic")
    setSymbol("Matic")
  }

  setErcTokenAddress('');
  setShowErc(false);
  setTokenChanged(false);
  getBal();
  } catch(error) {
    setError(error.message)
  }
}

const transferAmount = async () => {
  setMessage('');
  setTxLoading(true);
  try {
    if(tokenChanged) {
      const tx = await ERCContract.transfer(recipientAddress, ethers.utils.parseEther(amount));
      await tx.wait();
      selectToken();

      setRecentTx({
        txhash: tx.hash,
        from: address,
        to: recipientAddress,
        amount: amount,
        symbol: symbol
      })

      setShowRecentTx(true);

    } else {
      const tx = await paypalContract._transfer(recipientAddress, symbol, {
        value: ethers.utils.parseEther(amount)
      });

      await tx.wait();
      getBal();
    }

    setMessage("Transaction Sucessfull!")
    setAmount('');
  } catch (error) {
    setError(error.message)
  }

  setTxLoading(false);
 
}

const saveTx = async () => {
  setSaveTxLoad(true);
  try {
    const tx = await paypalContract.saveTx(recentTx.from, recentTx.to, ethers.utils.parseEther(recentTx.amount), recentTx.symbol);
    await tx.wait();

    setMessage("Transaction Saved Sucessfully!")
  } catch (error) {
    setError(error.message)
  }
  
  setShowRecentTx(false);
  setSaveTxLoad(false);
}

  useEffect(() => {
    ethereum.on("chainChanged", async (chainId) => {
      if(chainId == "0x3") {
        setChain("Ropsten")
        setCurrency("RopstenEther")
        setSymbol("rEth")
        setPaypalContractAddress('0xa02b2CCE714f874AD7593f50012c5d3756BF2773')
        setExplorer("https://ropsten.etherscan.io")
      } else if(chainId == "0x4") {
        setChain("Rinkeby")
        setCurrency("RinkebyEther")
        setSymbol("rEth")
        setPaypalContractAddress('0x6170b96101557cc11F076AA3907f7FF87Db54EE7')
        setExplorer("https://rinkeby.etherscan.io")
      } else if(chainId == "0x13881") {
        setChain("Polygon")
        setCurrency("Matic")
        setSymbol("Matic")
        setPaypalContractAddress('0x9Ad232e2D3812d5E915B864119f8212D51BFB9F5')
        setExplorer("https://mumbai.polygonscan.com")
      } else {
        setLogin(false);
      }

      getBal();
    })

    ethereum.on("accountsChanged", async (accounts) => {
      setAddress(accounts[0]) 
    })
  })

  useEffect(() => {
    if(tokenChanged) {
      selectToken();
    } else {
      getBal()
    }
  }, [address]) 

  useEffect(() => {
    removeToken();
  }, [chain])

  return (
    <AppState.Provider value={{login, setLogin, address, setAddress, chain, setChain, symbol, setSymbol, balance, setBalance, currency, setCurrency, getBal, ercTokenAddress, setErcTokenAddress, recipientAddress, setRecipientAddress, amount, setAmount, paypalContractAddress, setPaypalContractAddress, explorer, setExplorer, error, setError, message, setMessage, tokenChanged, setTokenChanged, removeToken, selectToken, transferAmount, showErc, setShowErc, ercLoading, setErcLoading, txLoading, setTxLoading, showRecentTx, setShowRecentTx, recentTx, setRecentTx, saveTxLoad, setSaveTxLoad, saveTx, paypalContract }}>

    <div className="min-w-full h-screen">
      { login ?
      <div className="min-w-full min-h-full">
        {/* Main Application */}
        <Header />
        <Main />
      </div>
      :
      <Login />
      }
    </div>
    </AppState.Provider>
  );
}

export default App;
export {AppState}
