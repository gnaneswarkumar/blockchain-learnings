import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";

import Layout from "../components/layout";
import { Link } from "../routes";

/**
 * Anytime we want to access data from etherium world, we need to make use of web3 and we need to setup a provider with it
 * Provider is what web3 uses to communicate with some external ethereum network
 * In the short term, we are going to rely upon the provider that we get automatically from metamask
 * Metamask automatically injects a provider into the page whenever it runs
 */
class CampaignIndex extends Component {
    static async getInitialProps(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        // console.log("campaigns",campaigns);

        return {campaigns};
    }

    renderCampaigns(){
        const items = this.props.campaigns.map(address=>{
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });

        return <Card.Group items={items} />
    }

    render() {
        return (
        <Layout>
            <div>
           <br />
           <h3>Open Campaigns</h3>
           <br />
            
            <Link route="/campaigns/new">
                <a>
                    <Button
                        content="Create Campaign"
                        icon="add circle"
                        primary
                        floated="right"
                    ></Button>
                </a>
            </Link>
            {this.renderCampaigns()}Campaigns Index
        </div>
        </Layout>
        )
    }
}

export default CampaignIndex;