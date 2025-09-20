"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Settings, ChevronDown, X, ArrowDownIcon, Info, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Token {
  symbol: string
  name: string
  balance: string
  icon: string
  color: string
}

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: "0.018", icon: "⟠", color: "bg-blue-500" },
  { symbol: "POL", name: "Polygon", balance: "0", icon: "⬟", color: "bg-purple-500" },
  { symbol: "USDC", name: "USD Coin", balance: "1,250.00", icon: "$", color: "bg-blue-600" },
  { symbol: "USDT", name: "Tether", balance: "890.50", icon: "₮", color: "bg-green-500" },
  { symbol: "DAI", name: "Dai Stablecoin", balance: "456.78", icon: "◈", color: "bg-yellow-500" },
]

export function SwapInterface() {
  const [mode, setMode] = useState<"swap" | "limit">("swap")
  const [fromToken, setFromToken] = useState<Token>(tokens[0]) // ETH
  const [toToken, setToToken] = useState<Token | null>(tokens[2]) // USDC
  const [fromAmount, setFromAmount] = useState("0.001")
  const [toAmount, setToAmount] = useState("4.45489")
  const [limitPrice, setLimitPrice] = useState("4471.36")
  const [selectedExpiry, setSelectedExpiry] = useState("1 week")
  const [showFromTokens, setShowFromTokens] = useState(false)
  const [showToTokens, setShowToTokens] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showMoreDetails, setShowMoreDetails] = useState(false)
  const [showExpandedDetails, setShowExpandedDetails] = useState(false)

  const adjustPrice = (percentage: number) => {
    const currentPrice = Number.parseFloat(limitPrice)
    const newPrice = currentPrice * (1 + percentage / 100)
    setLimitPrice(newPrice.toFixed(2))
  }

  const handleSwapTokens = () => {
    if (toToken) {
      const tempToken = fromToken
      const tempAmount = fromAmount
      setFromToken(toToken)
      setToToken(tempToken)
      setFromAmount(toAmount)
      setToAmount(tempAmount)
    }
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && !isNaN(Number(value)) && toToken) {
      const rate = fromToken.symbol === "ETH" ? 2500 : 0.0004
      setToAmount((Number(value) * rate).toFixed(6))
    } else {
      setToAmount("")
    }
  }

  const TokenSelector = ({
    token,
    onSelect,
    showTokens,
    setShowTokens,
    isSelectToken = false,
  }: {
    token: Token | null
    onSelect: (token: Token) => void
    showTokens: boolean
    setShowTokens: (show: boolean) => void
    isSelectToken?: boolean
  }) => (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          "h-auto p-3 rounded-2xl border-0 font-medium",
          isSelectToken
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80 text-foreground",
        )}
        onClick={() => setShowTokens(!showTokens)}
      >
        {token ? (
          <div className="flex items-center gap-2">
            <div
              className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-sm", token.color)}
            >
              {token.icon}
            </div>
            <span className="font-semibold">{token.symbol}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Select token</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        )}
      </Button>

      {showTokens && (
        <Card className="absolute top-full mt-2 w-80 z-50 bg-card border-border shadow-xl">
          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-foreground">Select a token</h3>
            </div>
            <div className="space-y-1">
              {tokens.map((t) => (
                <Button
                  key={t.symbol}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-accent rounded-xl"
                  onClick={() => {
                    onSelect(t)
                    setShowTokens(false)
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", t.color)}>
                      {t.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-foreground">{t.symbol}</div>
                      <div className="text-sm text-muted-foreground">{t.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-foreground">{t.balance}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const SwapModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">You're swapping</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-accent rounded-full"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* From Token */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-foreground">
              {fromAmount} {fromToken.symbol}
            </div>
            <div className="text-muted-foreground mt-1">$4.47</div>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg",
              fromToken.color,
            )}
          >
            {fromToken.icon}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDownIcon className="h-6 w-6 text-muted-foreground" />
        </div>

        {/* To Token */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-foreground">
              {toAmount} {toToken?.symbol}
            </div>
            <div className="text-muted-foreground mt-1">$4.45</div>
          </div>
          {toToken && (
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg",
                toToken.color,
              )}
            >
              {toToken.icon}
            </div>
          )}
        </div>

        {/* Show More Section */}
        <div className="border-t border-border pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground p-2"
          >
            <span>Show more</span>
            <div className="w-4 h-4 border border-muted-foreground rotate-45"></div>
          </Button>

          {showMoreDetails && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Fee (0.25%)</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-foreground">$0.01</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Network cost</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">⛽</span>
                  <span className="text-foreground">$0.52</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 text-xl font-semibold">
          Swap
        </Button>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-lg mx-auto space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant={mode === "swap" ? "secondary" : "ghost"}
            className={cn(
              "rounded-2xl px-4 py-2 font-medium",
              mode === "swap" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setMode("swap")}
          >
            Swap
          </Button>
          <Button
            variant={mode === "limit" ? "secondary" : "ghost"}
            className={cn(
              "rounded-2xl px-4 py-2 font-medium",
              mode === "limit" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setMode("limit")}
          >
            Limit
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-2xl px-4 py-2">
            Buy
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-2xl px-4 py-2">
            Sell
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {mode === "limit" ? (
        <>
          {/* Limit Price Section */}
          <Card className="bg-card border-border rounded-3xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>When 1</span>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs",
                      fromToken.color,
                    )}
                  >
                    {fromToken.icon}
                  </div>
                  <span>{fromToken.symbol} is worth</span>
                </div>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="text-6xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 text-foreground h-auto leading-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white text-sm",
                      toToken?.color,
                    )}
                  >
                    {toToken?.icon}
                  </div>
                  <span className="font-semibold text-foreground">{toToken?.symbol}</span>
                </div>
              </div>

              {/* Price Adjustment Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl px-3 py-1 text-sm bg-secondary text-foreground"
                  onClick={() => setLimitPrice("4471.36")}
                >
                  Market
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => adjustPrice(1)}
                >
                  +1%
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => adjustPrice(5)}
                >
                  +5%
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => adjustPrice(10)}
                >
                  +10%
                </Button>
              </div>
            </div>
          </Card>

          {/* Sell Section for Limit */}
          <Card className="bg-card border-border rounded-3xl p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Sell</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Balance: {fromToken.balance}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 text-sm px-2 py-0 h-auto"
                  >
                    Max
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="text-8xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/50 h-auto leading-none"
                  />
                </div>
                <TokenSelector
                  token={fromToken}
                  onSelect={setFromToken}
                  showTokens={showFromTokens}
                  setShowTokens={setShowFromTokens}
                />
              </div>
            </div>
          </Card>

          {/* Swap Button for Limit */}
          <div className="flex justify-center relative z-10 -my-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapTokens}
              className="rounded-full p-3 bg-secondary hover:bg-accent border border-border shadow-sm"
            >
              <ArrowUpDown className="h-4 w-4 text-foreground" />
            </Button>
          </div>

          {/* Buy Section for Limit */}
          <Card className="bg-card/50 border-border rounded-3xl p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Buy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0"
                    value={toAmount}
                    readOnly
                    className="text-8xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/50 h-auto leading-none"
                  />
                </div>
                <TokenSelector
                  token={toToken}
                  onSelect={setToToken}
                  showTokens={showToTokens}
                  setShowTokens={setShowToTokens}
                  isSelectToken={!toToken}
                />
              </div>
            </div>
          </Card>

          {/* Expiry Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Expiry</span>
            </div>
            <div className="flex items-center gap-2">
              {["1 day", "1 week", "1 month", "1 year"].map((expiry) => (
                <Button
                  key={expiry}
                  variant={selectedExpiry === expiry ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-xl px-3 py-1 text-sm",
                    selectedExpiry === expiry
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  onClick={() => setSelectedExpiry(expiry)}
                >
                  {expiry}
                </Button>
              ))}
            </div>
          </div>

          {/* Confirm Button for Limit */}
          <Button
            className="w-full bg-muted hover:bg-muted/80 text-muted-foreground rounded-2xl py-6 text-lg font-semibold mt-4"
            disabled
          >
            Confirm
          </Button>
        </>
      ) : (
        <>
          {/* Original Swap Interface */}
          {/* Sell Section */}
          <Card className="bg-card border-border rounded-3xl p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Sell</span>
                <span className="text-sm text-muted-foreground">
                  {fromToken.balance} {fromToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="text-8xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/50 h-auto leading-none"
                  />
                  <div className="text-sm text-muted-foreground mt-2">$4.45</div>
                </div>
                <TokenSelector
                  token={fromToken}
                  onSelect={setFromToken}
                  showTokens={showFromTokens}
                  setShowTokens={setShowFromTokens}
                />
              </div>
            </div>
          </Card>

          {/* Swap Button */}
          <div className="flex justify-center relative z-10 -my-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapTokens}
              className="rounded-full p-3 bg-secondary hover:bg-accent border border-border shadow-sm"
            >
              <ArrowUpDown className="h-4 w-4 text-foreground" />
            </Button>
          </div>

          {/* Buy Section */}
          <Card className="bg-card/50 border-border rounded-3xl p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Buy</span>
                {toToken && (
                  <span className="text-sm text-muted-foreground">
                    {toToken.balance} {toToken.symbol}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0"
                    value={toAmount}
                    readOnly
                    className="text-8xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/50 h-auto leading-none"
                  />
                  <div className="text-sm text-muted-foreground mt-2">$4.44</div>
                </div>
                <TokenSelector
                  token={toToken}
                  onSelect={setToToken}
                  showTokens={showToTokens}
                  setShowTokens={setShowToTokens}
                  isSelectToken={!toToken}
                />
              </div>
            </div>
          </Card>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 text-lg font-semibold mt-4"
          >
            Review
          </Button>

          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setShowExpandedDetails(!showExpandedDetails)}
              className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl p-3 h-auto"
            >
              <span>1 USDT = 0.000224472 ETH ($1.00)</span>
              <div className="flex items-center gap-1">
                {showExpandedDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>

            {showExpandedDetails && (
              <div className="space-y-3 px-3 pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Fee (0.25%)</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">$0.01</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Network cost</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">⛽</span>
                    <span className="text-foreground">$0.28</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Order routing</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">Uniswap API</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Price impact</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">-0.05%</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Max slippage</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">Auto 5.5%</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {showModal && <SwapModal />}
    </div>
  )
}
