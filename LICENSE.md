**\# LICENSE**

imagine.io Configurator SDK Boilerplate Copyright © 2026 Live Furnish, Inc., doing business as imagine.io. All rights reserved.

Publicly downloadable is not the same as freely usable. This repository is source-available, not open source.

"imagine.io," "we," and "us" mean Live Furnish, Inc., doing business as imagine.io. "You" means the individual or legal entity exercising rights under this license. If you act on behalf of an organization, as an employee or contractor, "you" includes that organization, and you confirm that you have authority to bind it.

By downloading, cloning, copying, installing, or using this repository, you accept this license. If you do not accept it, do not use the material.

Defined terms. "Platform" means the imagine.io Configurator Platform. "Terms" means the imagine.io Terms and Conditions, as updated from time to time. "Subscription" means a current, paid account-level Platform subscription under the Terms. A Free Plan is not a Subscription. "Client Subscription" means the per-client entitlement, purchased in addition to a Subscription, covering one client, customer, or brand for whom you build, deploy, or operate a configurator. "Enterprise Agreement" means a separately negotiated written agreement signed by you and imagine.io, including any master services agreement, enterprise order form, or similar instrument executed by both parties. "SDK" means the imagine.io Configurator SDK npm packages (including @imagineio/configurator-sdk and @imagineio/configurator-sdk-staging) and any pre-release or beta build of them. "SDK" does not include the imagine.io App SDK (@imagineio/imagine-app-sdk), which this license does not cover and in which this license grants no rights. "A configurator" means an application you build from this code, not the code in this repository itself.

\#\# 1\. What this license covers

This license covers the contents of this repository: the starter application, its source code, configuration, documentation, and the sample catalog workbooks (the "Boilerplate").

It does not cover:

\- The sample 3D assets distributed with the sample catalogs (models, textures, material definitions, thumbnails, preview renders, and HDRIs, whether in this repository or downloaded from its releases). A separate and stricter license covers them: data-samples/LICENSE-ASSETS.md.

\- The SDK. The license shipped inside the SDK package governs it. This license grants you no rights in the SDK. The obligations in section 4 that relate to the SDK are promises you make in exchange for access to the Boilerplate. They bind you in addition to the SDK's own license.

\- The Platform. The Terms govern your account, your use of the Platform, billing, usage limits, and AI features.

\#\# 2\. Non-commercial use, granted to everyone

Without a Subscription, and free of charge, you may:

\- Evaluate the SDK, the Platform, and this Boilerplate.

\- Develop and test a configurator, including with your own catalog data.

\- Learn from, copy, and modify the code in this repository for those purposes.

\- Demonstrate the result internally, or publicly in a non-commercial setting such as a conference talk, tutorial, or portfolio piece.

"Non-commercial" means the use does not, directly or indirectly, generate revenue, promote a product or service that is sold, generate leads or sales, or form part of a live, customer-facing offering. Internal prototypes inside a commercial company are fine. Anything a paying customer or a member of the public can transact against is not.

The sample 3D assets are subject to a stricter rule. Without a Subscription, you may not use the sample asset files in any sales demonstration to a prospective customer, pitch deck, or marketing material, even where the use would otherwise be Non-commercial under this section. Renders and other output depicting the sample assets remain Non-commercial regardless of Subscription status: you may not use, reproduce, distribute, or display that output for any commercial purpose, and neither a Subscription nor a Client Subscription grants any commercial right in it. That restriction is in addition to the license covering the sample asset files themselves, and grants no right to train, fine-tune, or evaluate any machine-learning or artificial-intelligence model. See section 1 and data-samples/LICENSE-ASSETS.md.

Use of the Platform on the Free Plan is subject to the Terms, including their non-commercial restriction.

\#\# 3\. Commercial use requires a Subscription

You need a Subscription or an Enterprise Agreement before you may:

\- Deploy a configurator to a production or customer-facing environment.

\- Use a configurator in, or as part of, any offering that is sold, licensed, or monetized, including advertising-supported and lead-generating deployments.

\- Deliver a configurator to a third party (a client, customer, or partner) as a product, a service, or a component of either.

While your Subscription or Enterprise Agreement is in effect, imagine.io grants you a non-exclusive, non-transferable, non-sublicensable license to use, copy, and modify the Boilerplate code for those purposes, subject to this license, the SDK license, and the Terms. A Subscription does not lift section 4, and it does not change the asset license.

The number of deployments you may run, and your usage limits, are set by your plan, the Terms, and any Enterprise Agreement, not by this license.

You need a Client Subscription for each third party (each client, customer, or brand) for whom you build, deploy, or operate a configurator, whether or not that party operates it itself, unless an Enterprise Agreement expressly provides otherwise. Deploying a configurator for any client, customer, or brand for which you do not hold a current Client Subscription is not licensed.

Delivering a configurator is not the same as delivering this repository. Passing on the Boilerplate itself as source, a starter kit, a template, or a development tool is never permitted. See section 4\.

If your Subscription or Enterprise Agreement ends, the rights in this section end with it. Take the deployment down or renew.

\#\# 4\. What you may never do

Regardless of Subscription status, you may not:

\- Redistribute the SDK. Do not republish, mirror, sublicense, or bundle the SDK, or any part of it, for others to obtain from you rather than from imagine.io. Including the SDK in the compiled build of a configurator you are licensed to deploy is not redistribution.

\- Redistribute this Boilerplate. Do not publish, mirror, resell, or otherwise pass on this repository, or a modified copy of it, as a starter kit, template, boilerplate, or development tool for others to build from. A fork created on GitHub through GitHub's own functionality is permitted only to the extent GitHub's Terms of Service require, and remains subject to this license.

\- Reverse engineer the SDK, including by deobfuscating, decompiling, or reconstructing its source, except to the extent applicable law expressly permits this despite this restriction.

\- Remove or obscure attribution, copyright notices, watermarks, or license files, in this repository or in the SDK.

\- Use imagine.io trademarks or branding to imply endorsement, partnership, or affiliation you do not have.

\- Build a competing product. Do not use this code, the SDK, or their documentation to design, build, train, improve, or operate a product or service that competes with the Platform or the SDK.

\- Expose credentials. Do not place a permanent API key in client-side code or any publicly accessible page. The .env setup in this repository is for local development only. Production deployments must use a server-side authentication flow and short-lived session tokens as the SDK documentation describes. You are responsible for your API keys, session tokens, and share links as the Terms describe.

\#\# 5\. Contributions

imagine.io does not currently accept outside contributions to this repository except under a separate contributor agreement. If you submit an issue, pull request, suggestion, or other material ("Contribution") anyway, you grant imagine.io a perpetual, irrevocable, worldwide, royalty-free, fully paid, sublicensable, and transferable license to use, copy, modify, distribute, and otherwise exploit that Contribution for any purpose, and you confirm that you have the right to grant that license. imagine.io has no obligation to use any Contribution.

\#\# 6\. No warranty, no liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE BOILERPLATE AND THE ACCOMPANYING DATA ARE PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL IMAGINE.IO BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE BOILERPLATE OR ITS USE.

The Terms and any Enterprise Agreement govern the availability, uptime, support, and data durability of the Platform. This license does not. Nothing in this repository or its documentation is a service-level commitment. The API keys, endpoints, and sample catalogs referenced here are for evaluation and development, not a provisioned production tenant.

Pre-release and beta builds of the SDK carry no availability, stability, or compatibility commitment, and their interfaces may change between releases.

\#\# 7\. Termination

This license ends automatically if you breach it, and imagine.io may end the rights in section 2 at any time by notice. When this license ends, stop using and distributing the Boilerplate and delete the sample assets. The rights in section 3 end when your Subscription or Enterprise Agreement ends. Sections 1 and 4 through 8 survive termination.

\#\# 8\. Governing terms

The governing law, dispute resolution, and venue provisions of the Terms apply to this license, including any obligation to arbitrate. For any proceeding that the Terms permit to be brought in court, the state and federal courts located in Williamson County, Texas have exclusive jurisdiction and venue, and you consent to that jurisdiction and venue.

If this license and an Enterprise Agreement conflict, the Enterprise Agreement controls, but only to the extent it expressly addresses the conflicting subject.

If this license and the SDK's own license conflict about the SDK, the SDK license controls. This file governs the Boilerplate, not the SDK. The SDK restrictions in section 4 apply in addition to, and not in place of, the SDK license. Where both restrict the same conduct, the stricter restriction applies.

For the sample 3D assets, the asset license always controls over this file, and a Subscription does not loosen it. See section 1 and data-samples/LICENSE-ASSETS.md.

Licensing inquiries: finance@imagine.io