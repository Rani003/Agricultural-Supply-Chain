package main

import (
    "encoding/json"
    "fmt"
    "time"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Product struct {
    ID             string    `json:"id"`
    Name           string    `json:"name"`
    Farmer         string    `json:"farmer"`
    CurrentOwner   string    `json:"currentOwner"`
    Status         string    `json:"status"`
    HarvestDate    time.Time `json:"harvestDate"`
    Location       string    `json:"location"`
    Temperature    float64   `json:"temperature"`
    TransportSteps []Step    `json:"transportSteps"`
}

type Step struct {
    Timestamp     time.Time `json:"timestamp"`
    Location      string    `json:"location"`
    Handler       string    `json:"handler"`
    StatusUpdate  string    `json:"statusUpdate"`
}

type SupplyChainContract struct {
    contractapi.Contract
}

func (sc *SupplyChainContract) RegisterProduct(ctx contractapi.TransactionContextInterface, 
    id, name, farmer, location string, temperature float64) error {
    
    existingProduct, err := ctx.GetStub().GetState(id)
    if err != nil {
        return fmt.Errorf("error checking product existence: %v", err)
    }
    if existingProduct != nil {
        return fmt.Errorf("product with ID %s already exists", id)
    }

    product := Product{
        ID:           id,
        Name:         name,
        Farmer:       farmer,
        CurrentOwner: farmer,
        Status:       "Harvested",
        HarvestDate:  time.Now(),
        Location:     location,
        Temperature:  temperature,
        TransportSteps: []Step{
            {
                Timestamp:    time.Now(),
                Location:     location,
                Handler:      farmer,
                StatusUpdate: "Product Harvested",
            },
        },
    }

    productJSON, err := json.Marshal(product)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, productJSON)
}

func (sc *SupplyChainContract) UpdateProductStatus(ctx contractapi.TransactionContextInterface, 
    id, handler, location, statusUpdate string, temperature float64) error {
    
    productJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return fmt.Errorf("error getting product: %v", err)
    }
    if productJSON == nil {
        return fmt.Errorf("product with ID %s does not exist", id)
    }

    var product Product
    err = json.Unmarshal(productJSON, &product)
    if err != nil {
        return err
    }

    newStep := Step{
        Timestamp:     time.Now(),
        Location:      location,
        Handler:       handler,
        StatusUpdate:  statusUpdate,
    }

    product.TransportSteps = append(product.TransportSteps, newStep)
    product.CurrentOwner = handler
    product.Location = location
    product.Temperature = temperature
    product.Status = statusUpdate

    updatedProductJSON, err := json.Marshal(product)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, updatedProductJSON)
}

func (sc *SupplyChainContract) TrackProduct(ctx contractapi.TransactionContextInterface, id string) (*Product, error) {
    productJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, fmt.Errorf("error getting product: %v", err)
    }
    if productJSON == nil {
        return nil, fmt.Errorf("product with ID %s does not exist", id)
    }

    var product Product
    err = json.Unmarshal(productJSON, &product)
    if err != nil {
        return nil, err
    }

    return &product, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(&SupplyChainContract{})
    if err != nil {
        fmt.Printf("Error creating supply chain chaincode: %v", err)
        return
    }

    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting supply chain chaincode: %v", err)
    }
}
