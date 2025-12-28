local QZMarket = class("QZMarket", vRP.Extension)

function QZMarket:__construct()
    vRP.Extension.__construct(self)
end


RegisterServerEvent("qz_market:purchase")
AddEventHandler("qz_market:purchase", function(cart)
    local user = vRP.users_by_source[source]
    if user then
        local total = 0
        for _, item in ipairs(cart) do
            total = total + item.price * item.quantity
        end
        if user:tryPayment(total) then
            for _, item in ipairs(cart) do
                local itemCode = item.itemCode
                user:tryGiveItem(itemCode, item.quantity)
            end
            TriggerClientEvent("qz_market:purchaseResult", source, true)
        else
            vRP.EXT.Base.remote._notify(source, {"Not enough money!"})
        end
    end
end)

vRP:registerExtension(QZMarket)